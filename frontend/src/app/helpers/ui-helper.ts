import {Injectable} from '@angular/core';
import {DialogComponent} from '../generic-controls/dialog/dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Injectable({providedIn: 'root'})
export class UiHelper {
  constructor(private snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  public openSnackBar(message: string, action: string, className: string, duration: number = 5000) {
    this.snackBar.open(message, action, {
      duration,
      panelClass: [className]
    });
  }


  async openDialog(title: string, message: string = '', trueText: string = '', falseText: string = ''): Promise<boolean> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: {title, message, trueText, falseText}
    });
    return dialogRef.afterClosed().toPromise();
  }
}
