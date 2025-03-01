package com.codeflix.admin.catalog.domain.exceptions;

import java.util.List;
import com.codeflix.admin.catalog.domain.validation.Error;

public class DomainException extends RuntimeException {

    protected final List<Error> errors;

    protected DomainException(final List<Error> anErrors) {
        super("", null, true, false);
        this.errors = anErrors;
    }

    public static DomainException with(final List<Error> anErrors) {
        return new DomainException(anErrors);
    }

    public List<Error> getErrors() {
        return errors;
    }
}
