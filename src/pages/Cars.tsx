import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { toast } from "sonner";

interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  image_url: string | null;
}

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchCars();
  }, [sortBy]);

  const fetchCars = async () => {
    try {
      let query = supabase.from("cars").select("*");

      // Apply sorting
      if (sortBy === "price-low") {
        query = query.order("price", { ascending: true });
      } else if (sortBy === "price-high") {
        query = query.order("price", { ascending: false });
      } else {
        query = query.order("year", { ascending: false });
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      toast.error("Failed to load cars");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === "all" || car.brand.toLowerCase() === brandFilter.toLowerCase();
    return matchesSearch && matchesBrand;
  });

  const brands = [...new Set(cars.map(car => car.brand))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Browse Our Collection</h1>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Car Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading cars...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-semibold mb-2">No cars found</p>
            <p className="text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filteredCars.map(car => (
              <Link key={car.id} to={`/cars/${car.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer h-full">
                  <div className="overflow-hidden bg-secondary h-48">
                    {car.image_url ? (
                      <img 
                        src={car.image_url} 
                        alt={car.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{car.title}</h3>
                    <p className="text-muted-foreground mb-1">{car.brand} {car.model}</p>
                    <p className="text-2xl font-bold text-primary mb-4">
                      ${car.price.toLocaleString()}
                    </p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{car.year}</span>
                      <span>{car.mileage.toLocaleString()} mi</span>
                      <span>{car.transmission}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
