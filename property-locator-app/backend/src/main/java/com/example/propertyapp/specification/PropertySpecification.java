package com.example.propertyapp.specification;

import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

import com.example.propertyapp.model.Property;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class PropertySpecification {

    public static Specification<Property> filterProperties(
            String cityName,
            String streetName,
            String houseNumber,
            String propertyType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minBedrooms,
            String status,
            String searchText) {

        return (Root<Property> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            Predicate predicate = cb.conjunction();

            if (cityName != null && !cityName.trim().isEmpty()) {
                Join<Object, Object> streetJoin = root.join("street");
                Join<Object, Object> cityJoin = streetJoin.join("city");
                predicate = cb.and(
                        predicate,
                        cb.like(
                                cb.lower(cityJoin.get("cityName").as(String.class)),
                                "%" + cityName.toLowerCase() + "%"
                        )
                );
            }

            if (streetName != null && !streetName.trim().isEmpty()) {
                Join<Object, Object> streetJoin = root.join("street");
                predicate = cb.and(
                        predicate,
                        cb.like(
                                cb.lower(streetJoin.get("streetName").as(String.class)),
                                "%" + streetName.toLowerCase() + "%"
                        )
                );
            }

            if (houseNumber != null && !houseNumber.trim().isEmpty()) {
                predicate = cb.and(
                        predicate,
                        cb.like(
                                cb.lower(root.get("houseNumber").as(String.class)),
                                "%" + houseNumber.toLowerCase() + "%"
                        )
                );
            }

            if (propertyType != null && !propertyType.trim().isEmpty()) {
                predicate = cb.and(
                        predicate,
                        cb.equal(cb.lower(root.get("propertyType").as(String.class)), propertyType.toLowerCase())
                );
            }

            if (minPrice != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicate = cb.and(predicate, cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (minBedrooms != null) {
                predicate = cb.and(predicate, cb.greaterThanOrEqualTo(root.get("bedrooms"), minBedrooms));
            }

            if (status != null && !status.trim().isEmpty()) {
                if (status.equalsIgnoreCase("Available")) {
                    predicate = cb.and(
                            predicate,
                            root.get("listingStatus").in(
                                    Property.ListingStatus.FOR_SALE,
                                    Property.ListingStatus.FOR_RENT
                            )
                    );
                } else if (status.equalsIgnoreCase("Sold")) {
                    predicate = cb.and(
                            predicate,
                            cb.equal(root.get("listingStatus"), Property.ListingStatus.SOLD)
                    );
                }
            }

            if (searchText != null && !searchText.trim().isEmpty()) {
                String pattern = "%" + searchText.toLowerCase() + "%";
                Join<Object, Object> streetJoin = root.join("street");
                predicate = cb.and(
                        predicate,
                        cb.or(
                                cb.like(cb.lower(root.get("title")), pattern),
                                cb.like(cb.lower(root.get("description")), pattern),
                                cb.like(cb.lower(streetJoin.get("streetName")), pattern)
                        )
                );
            }

            return predicate;
        };
    }
}
