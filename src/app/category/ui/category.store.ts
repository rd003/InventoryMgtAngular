import { Injectable, inject } from "@angular/core";
import { CategoryModel } from "../category.model";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ComponentStore,
  OnStateInit,
  OnStoreInit,
  tapResponse,
} from "@ngrx/component-store";
import { exhaustMap, switchMap, tap } from "rxjs";
import { CategoryService } from "../category.service";

interface CategoryState {
  categories: CategoryModel[];
  loading: boolean;
  error: HttpErrorResponse | null;
  searchTerm: string;
}

const initialState = {
  categories: [],
  loading: false,
  error: null,
  searchTerm: "",
};

@Injectable()
export class CategoryStore
  extends ComponentStore<CategoryState>
  implements OnStoreInit, OnStateInit
{
  private categoryService = inject(CategoryService);
  private loading$ = this.select((a) => a.loading);
  private searchTerm$ = this.select((a) => a.searchTerm);
  private categories$ = this.select((a) => a.categories);
  private error$ = this.select((a) => a.error);

  vm$ = this.select({
    categories: this.categories$,
    loading: this.loading$,
    error: this.error$,
  });

  constructor() {
    super(initialState);
  }

  ngrxOnStoreInit() {
    // called after store has been instantiated
  }

  ngrxOnStateInit() {
    // called once after state has been first initialized
    this.loadCategories();
  }

  readonly setSearchTerm = this.updater((state, searchTerm: string) => ({
    ...state,
    searchTerm,
  }));

  private readonly setLoading = this.updater((state) => ({
    ...state,
    loading: true,
  }));

  private readonly setError = this.updater(
    (state, error: HttpErrorResponse) => ({
      ...state,
      error,
      loading: false,
    })
  );

  private readonly addCategory = this.updater(
    (state, category: CategoryModel) => {
      //   console.log(category);
      return {
        ...state,
        categories: [...state.categories, category],
        loading: false,
      };
    }
  );

  private readonly editCatgory = this.updater(
    (state, category: CategoryModel) => ({
      ...state,
      loading: false,
      categories: state.categories.map((c) =>
        c.id == category.id ? category : c
      ),
    })
  );

  private readonly removeCategory = this.updater((state, id: number) => ({
    ...state,
    categories: state.categories.filter((c) => c.id !== id),
    loading: false,
  }));

  private readonly addCategories = this.updater(
    (state, categories: CategoryModel[]) => ({
      ...state,
      categories,
      loading: false,
    })
  );

  private readonly loadCategories = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap((_) => this.setLoading()),
      exhaustMap((_) =>
        this.searchTerm$.pipe(
          switchMap((sTerm) =>
            this.categoryService.getCategories(sTerm).pipe(
              tapResponse(
                (categories: CategoryModel[]) => this.addCategories(categories),
                (error: HttpErrorResponse) => this.setError(error)
              )
            )
          )
        )
      )
    )
  );

  readonly saveCategory = this.effect<CategoryModel>((trigger$) =>
    trigger$.pipe(
      tap((_) => this.setLoading()),
      switchMap((category) =>
        this.categoryService.addCategory(category).pipe(
          tapResponse(
            (createdCategory: CategoryModel) => {
              console.log({ createdCategory });
              this.addCategory(createdCategory);
            },
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    )
  );

  readonly updateCategory = this.effect<CategoryModel>((trigger$) =>
    trigger$.pipe(
      tap((_) => this.setLoading()),
      switchMap((category) =>
        this.categoryService.updateCategory(category).pipe(
          tapResponse(
            (updatedCategory) => {
              console.log(updatedCategory);
              this.editCatgory(updatedCategory);
            },
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    )
  );

  readonly deleteCategory = this.effect<number>((trigger$) =>
    trigger$.pipe(
      tap((_) => this.setLoading()),
      switchMap((id) =>
        this.categoryService.deleteCategory(id).pipe(
          tapResponse(
            () => this.removeCategory(id),
            (error: HttpErrorResponse) => this.setError(error)
          )
        )
      )
    )
  );
}
