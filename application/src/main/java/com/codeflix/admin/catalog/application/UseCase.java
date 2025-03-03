package com.codeflix.admin.catalog.application;

import com.codeflix.admin.catalog.domain.category.Category;

public abstract class UseCase<IN, OUT> {
   public abstract OUT execute(IN anIn);
}