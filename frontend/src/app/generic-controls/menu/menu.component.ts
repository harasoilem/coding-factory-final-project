import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {UiHelper} from "../../helpers/ui-helper";
import {removeAccessToken, setAccessToken} from "../../models/token";
import {Router} from "@angular/router";
import {UsernameItem} from "../../helpers/local-storage/username-item";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  username: string;


  constructor(private uiHelper: UiHelper, private router: Router,) {
  }

  ngOnInit(): void {
    this.username = new UsernameItem().getItem();
  }

  async onLogout() {
    const result = await this.uiHelper.openDialog("Logout", "Are you sure you want to logout?", "Logout", "Cancel")
    if (result != null && result == true) {
      removeAccessToken();
      new UsernameItem().removeItem();
      setTimeout(async () => {
        await this.router.navigate(['/login']);
      }, 200);
    }
  }
}
