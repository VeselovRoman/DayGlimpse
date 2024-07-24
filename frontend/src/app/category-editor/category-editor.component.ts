import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../_services/category.service';
import { Category } from '../_models/category';

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category-editor.component.css']
})
export class CategoryEditorComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns: string[] = ['id', 'mainGroup', 'costGroup', 'costCategory','costIndex','costName', 'actions'];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  save(category: Category): void {
    this.categoryService.updateCategory(category).subscribe(() => {
      console.log('Update successful');
    });
  }

  delete(category: Category): void {
    this.categoryService.deleteCategory(category.id).subscribe(() => {
      console.log('Deletion successful');
      this.categories = this.categories.filter(c => c.id !== category.id);
    });
  }
}
