import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone  : true,
  selector: 'app-modal-renovar-sesion',
  templateUrl: './modal-renovar-session.component.html',
  styleUrls: ['./modal-renovar-session.component.css'],
  imports: [MatDialogModule, MatButtonModule],
})
export class ModalRenovarSessionComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalRenovarSessionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  aceptar(): void {
    this.dialogRef.close(true);
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
