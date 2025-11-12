import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Shield, Award, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import heroImage from "@/assets/hero-car.jpg";
import featuredCar1 from "@/assets/featured-car-1.jpg";
import featuredCar2 from "@/assets/featured-car-2.jpg";
import featuredCar3 from "@/assets/featured-car-3.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Find Your Dream Car{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Today
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover premium vehicles from trusted dealers. Quality, performance, and luxury in every ride.
            </p>
            <div className="flex gap-4">
              <Link to="/cars">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-dark hover:opacity-90 text-lg px-8">
                  Browse Cars <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trusted Quality</h3>
              <p className="text-muted-foreground">
                Every vehicle undergoes rigorous inspection for your peace of mind
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Selection</h3>
              <p className="text-muted-foreground">
                Curated collection of luxury and performance vehicles
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all">
            <CardContent className="pt-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Process</h3>
              <p className="text-muted-foreground">
                Quick approval and seamless purchase experience
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Vehicles</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
              <div className="overflow-hidden">
                <img 
                  src={featuredCar1} 
                  alt="Red Sports Car"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Sport Series</h3>
                <p className="text-muted-foreground mb-4">Starting from $89,900</p>
                <Link to="/cars">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
              <div className="overflow-hidden">
                <img 
                  src={featuredCar2} 
                  alt="Black SUV"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Luxury SUVs</h3>
                <p className="text-muted-foreground mb-4">Starting from $75,500</p>
                <Link to="/cars">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
              <div className="overflow-hidden">
                <img 
                  src={featuredCar3} 
                  alt="White Electric Sedan"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">Electric Range</h3>
                <p className="text-muted-foreground mb-4">Starting from $65,000</p>
                <Link to="/cars">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <Card className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground overflow-hidden">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Drive Your Dream?</h2>
            <p className="text-xl mb-8 opacity-90">
              Create an account and start exploring our premium collection
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
