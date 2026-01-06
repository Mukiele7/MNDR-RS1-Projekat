import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DeleteDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="delete-dialog">
      <div class="dialog-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Otkaži' }}
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()">
          {{ data.confirmText || 'Obriši' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .delete-dialog {
      padding: 10px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px;

      .warning-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
        color: #f44336;
      }

      h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }
    }

    mat-dialog-content {
      padding: 20px 0;

      p {
        font-size: 1rem;
        color: #666;
        line-height: 1.6;
      }
    }

    mat-dialog-actions {
      padding: 15px 0 0 0;
      gap: 10px;

      button {
        min-width: 100px;
      }
    }
  `]
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
