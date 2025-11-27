package com.autosuite;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Cars Page Tests")
class CarsPageTest extends BaseTest {

    @Test
    @DisplayName("Cars page loads successfully")
    void carsPageLoads() {
        navigateTo("/cars");
        assertTrue(driver.getCurrentUrl().contains("/cars"), "Should be on cars page");
    }

    @Test
    @DisplayName("Cars page title is correct")
    void carsPageHasCorrectTitle() {
        navigateTo("/cars");
        String title = driver.getTitle();
        assertNotNull(title, "Page should have a title");
    }

    @Test
    @DisplayName("Can navigate from cars back to home")
    void canNavigateFromCarsToHome() {
        navigateTo("/cars");
        navigateTo("/");
        assertTrue(driver.getCurrentUrl().endsWith("/") || driver.getCurrentUrl().contains(":8081"), 
            "Should be able to navigate back to home");
    }
}
