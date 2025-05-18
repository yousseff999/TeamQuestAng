import { Component, OnInit } from '@angular/core';
import { DefiService } from 'src/app/services/defi.service';
import { Defi } from 'src/app/models/defi';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alldefi',
  templateUrl: './alldefi.component.html',
  styleUrls: ['./alldefi.component.css']
})
export class AlldefiComponent implements OnInit {
  defis: Defi[] = [];
  searchKeyword: string = '';
  loading: boolean = true;
  error: string | null = null;

  constructor(private defiService: DefiService, private router: Router, ) {}

  ngOnInit(): void {
    this.getAllDefis();
  }

  getAllDefis(): void {
    this.defiService.getAllDefis().subscribe({
      next: (data) => {
        this.defis = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = "❌ Failed to load challenges.";
        this.loading = false;
      }
    });
  }

  searchDefis(): void {
    if (this.searchKeyword.trim()) {
      this.defiService.searchDefisByKeyword(this.searchKeyword).subscribe({
        next: (data) => this.defis = data,
        error: () => this.error = "❌ Failed to search challenges."
      });
    } else {
      this.getAllDefis();
    }
  }
  viewDefiSubmissions(defiId: number) {
  this.router.navigate(['/defisubmissions'], { state: { defiId } });
}

}
