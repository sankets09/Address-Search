package com.example.propertyapp.specification;

import org.springframework.data.jpa.domain.Specification;

import com.example.propertyapp.model.Property;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class PropertySpecification {

    public static Specification<Property> filterProperties(
            String buildingName,
            String houseNumber,
            String street,
            String city) {

        return (Root<Property> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            Predicate predicate = cb.conjunction();

            // Building Name (title field) - partial, case-insensitive
            if (buildingName != null && !buildingName.trim().isEmpty()) {
                predicate = cb.and(
                        predicate,
                        cb.like(
                                cb.lower(root.get("title").as(String.class)),
                                "%" + buildingName.toLowerCase() + "%"
                        )
                );
            }

            // House Number - exact match
            if (houseNumber != null && !houseNumber.trim().isEmpty()) {
                predicate = cb.and(
                        predicate,
                        cb.equal(
                                root.get("houseNumber").as(String.class),
                                houseNumber.trim()
                        )
                );
            }

            // Street - partial, case-insensitive
            if (street != null && !street.trim().isEmpty()) {
                Join<Object, Object> streetJoin = root.join("street");
                predicate = cb.and(
                        predicate,
                        cb.like(
                                cb.lower(streetJoin.get("streetName").as(String.class)),
                                "%" + street.toLowerCase() + "%"
                        )
                );
            }

            // City - partial, case-insensitive
            if (city != null && !city.trim().isEmpty()) {
                Join<Object, Object> streetJoin = root.join("street");
                Join<Object, Object> cityJoin = streetJoin.join("city");
                predicate = cb.and(
                        predicate,
                        cb.like(
                                cb.lower(cityJoin.get("cityName").as(String.class)),
                                "%" + city.toLowerCase() + "%"
                        )
                );
            }

            return predicate;
        };
    }
}

