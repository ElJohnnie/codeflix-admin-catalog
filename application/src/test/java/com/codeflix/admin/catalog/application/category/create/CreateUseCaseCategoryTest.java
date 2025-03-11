package com.codeflix.admin.catalog.application.category.create;

import com.codeflix.admin.catalog.domain.category.CategoryGateway;
import com.codeflix.admin.catalog.domain.exceptions.DomainException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.Mockito.*;

import java.util.Objects;

@ExtendWith(MockitoExtension.class)
public class CreateUseCaseCategoryTest {

    @InjectMocks
    private DefaultCreateCategoryUseCase useCase;

    @Mock
    private CategoryGateway categoryGateway;

    @BeforeEach
    void setUp() {
        useCase = new DefaultCreateCategoryUseCase(categoryGateway);
    }

    @Test
    public void givenAValidCommand_whenCallsCreateCategory_shouldReturnCategoryId() {
        final var expectedName = "Filmes";
        final var expectedDescription = "A categoria mais assistida";
        final var expectedIsActive = true;

        final var aCommand =
                CreateCategoryCommand.with(expectedName, expectedDescription, expectedIsActive);

        when(categoryGateway.create(any())).thenAnswer(returnsFirstArg());

        final var actualOutput = useCase.execute(aCommand);

        Assertions.assertNotNull(actualOutput);
        Assertions.assertNotNull(actualOutput.id());

        verify(categoryGateway, times(1)).create(argThat(aCategory ->
                Objects.equals(expectedName, aCategory.getName()) &&
                        Objects.equals(expectedDescription, aCategory.getDescription()) &&
                        Objects.equals(expectedIsActive, aCategory.isActive()) &&
                        Objects.nonNull(aCategory.getId()) &&
                        Objects.nonNull(aCategory.getCreatedAt()) &&
                        Objects.nonNull(aCategory.getUpdatedAt()) &&
                        Objects.isNull(aCategory.getDeletedAt())
        ));
    }

    @Test
    public void givenAInvalidName_whenCallsCreateCategory_thenShouldReturnDomainException() {
        final String expectedName = null;
        final var expectedDescription = "A categoria mais assistida";
        final var expectedIsActive = true;
        final var expectedErrorMessage = "'name' should not be null";

        final var aCommand =
                CreateCategoryCommand.with(expectedName, expectedDescription, expectedIsActive);

        final var actualException = Assertions.assertThrows(DomainException.class, () -> useCase.execute(aCommand));

        Assertions.assertEquals(expectedErrorMessage, actualException.getMessage());

        Mockito.verify(categoryGateway, times(0)).create(any());
    }

    @Test
    public void givenAValidCommandWithInactiveCategory_whenCallsCreateCategory_shouldReturnInactiveCategoryId() {
        final var expectedName = "Filmes";
        final var expectedDescription = "A categoria mais assistida";
        final var expectedIsActive = false;

        final var aCommand =
                CreateCategoryCommand.with(expectedName, expectedDescription, expectedIsActive);

        when(categoryGateway.create(any())).thenAnswer(returnsFirstArg());

        final var actualOutput = useCase.execute(aCommand);

        Assertions.assertNotNull(actualOutput);
        Assertions.assertNotNull(actualOutput.id());

        verify(categoryGateway, times(1)).create(argThat(aCategory ->
                Objects.equals(expectedName, aCategory.getName()) &&
                        Objects.equals(expectedDescription, aCategory.getDescription()) &&
                        Objects.equals(expectedIsActive, aCategory.isActive()) &&
                        Objects.nonNull(aCategory.getId()) &&
                        Objects.nonNull(aCategory.getCreatedAt()) &&
                        Objects.nonNull(aCategory.getUpdatedAt()) &&
                        Objects.nonNull(aCategory.getDeletedAt())
        ));

        Mockito.verify(categoryGateway, times(1)).create(any());
    }

    @Test
    public void givenAValidCommand_whenGatewayThrowsRandomException_shouldReturnAException() {
        final var expectedName = "Filmes";
        final var expectedDescription = "A categoria mais assistida";
        final var expectedIsActive = true;
        final var expectedErrorMessage = "Gateway error";

        final var aCommand =
                CreateCategoryCommand.with(expectedName, expectedDescription, expectedIsActive);

        when(categoryGateway.create(any()))
                .thenThrow(new IllegalStateException(expectedErrorMessage));

        final var actualException = Assertions.assertThrows(IllegalStateException.class, () -> useCase.execute(aCommand));

        Assertions.assertEquals(expectedErrorMessage, actualException.getMessage());

        Mockito.verify(categoryGateway, times(1)).create(any());
    }
}
