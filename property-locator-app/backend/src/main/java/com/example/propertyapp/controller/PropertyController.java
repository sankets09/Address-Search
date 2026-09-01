package com.example.propertyapp.controller;

import java.math.BigDecimal;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.propertyapp.dto.ErrorResponse;
import com.example.propertyapp.model.Property;
import com.example.propertyapp.repository.PropertyRepository;
import com.example.propertyapp.specification.PropertySpecification;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:4200")
public class PropertyController {

    private final PropertyRepository propertyRepository;

    @Autowired
    public PropertyController(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProperties(
            @RequestParam(required = false) String buildingName,
            @RequestParam(required = false) String houseNumber,
            @RequestParam(required = false) String street,
            @RequestParam(required = false) String city) {

        // Validate that at least one search parameter is provided
        if ((buildingName == null || buildingName.trim().isEmpty()) &&
            (houseNumber == null || houseNumber.trim().isEmpty()) &&
            (street == null || street.trim().isEmpty()) &&
            (city == null || city.trim().isEmpty())) {
            return ResponseEntity.badRequest().body(
                    new ErrorResponse("At least one search field must be provided")
            );
        }

        return ResponseEntity.ok(
                propertyRepository.findAll(
                        PropertySpecification.filterProperties(
                                buildingName,
                                houseNumber,
                                street,
                                city
                        )
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        Optional<Property> property = propertyRepository.findById(id);

        if (property.isPresent()) {
            return ResponseEntity.ok(property.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
