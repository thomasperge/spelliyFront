import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { v4 as uuidv4 } from 'uuid';
import { UnknownUserService } from './services/unknown-user.service';
import { UsagesService } from './services/usages.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'GrammifyFront';
  isDisplayNavBar = true;

  constructor(private router: Router, private unknownUserService: UnknownUserService, private usagesService: UsagesService) {
    // Check all changement route
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Undisplay navbar if /login or /signup route
        if (this.router.url.startsWith('/login') || this.router.url.startsWith('/signup')) {
          this.isDisplayNavBar = false
        } else {
          this.isDisplayNavBar = true
        }
      }
    });
  }

  generateUuid() {
    return uuidv4();
  }

  async ngOnInit(): Promise<void> {
    initFlowbite();

    // Init Unknwown User
    const userId = localStorage.getItem('userId');

    // Check if user have localstorage userId
    if (userId) {
      // Get usages from id in local storage
      let nbUsages = await this.unknownUserService.getUsageUnknownUser(userId)

      // User change id in the localStorage (response -1 = Bad request)
      if (nbUsages == -1) {
        this.router.navigate(['/login'])
      } else {
        // user have correct id = set current usage from DB
        this.usagesService.setUsages(nbUsages)
      }
    } else {

      // Set id user in localStorage
      const newUserId = this.generateUuid();
      localStorage.setItem('userId', newUserId);
      
      // Set id user in DB
      this.unknownUserService.createUnknownUser(newUserId)
    }
  }
}
