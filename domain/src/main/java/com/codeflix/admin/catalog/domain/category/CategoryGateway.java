package com.codeflix.admin.catalog.domain.category;

import com.codeflix.admin.catalog.domain.pagination.Pagination;
import com.codeflix.admin.catalog.domain.pagination.SearchQuery;

import java.util.Optional;

public interface CategoryGateway {

    Category create(Category aCategory);

    void deleteByid(CategoryID anId);

    Optional<Category> findById(CategoryID anId);

    Category updated(Category aCategory);

    Pagination<Category> findAll(SearchQuery aQuery);
}
