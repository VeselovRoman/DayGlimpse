import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-editor-dialog',
  templateUrl: './comment-editor-dialog.component.html',
})
export class CommentEditorDialogComponent {
  commentEditValue: string;

  constructor(
    public dialogRef: MatDialogRef<CommentEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { comment: string }
  ) {
    this.commentEditValue = data.comment;
  }

  onSave(): void {
    this.dialogRef.close(this.commentEditValue);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
