import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  features = [
    {
      icon: 'home_repair_service',
      title: 'Pronađi Majstore',
      description: 'Pronađi stručne majstore za sve vrste poslova'
    },
    {
      icon: 'credit_card',
      title: 'Krediti',
      description: 'Jednostavno kupuj kredite i plaćaj usluge'
    },
    {
      icon: 'verified_user',
      title: 'Sigurnost',
      description: 'Zaštićeni profili i sigurne transakcije'
    },
    {
      icon: 'support_agent',
      title: 'Podrška',
      description: '24/7 podrška za sve tvoje potrebe'
    }
  ];
}
