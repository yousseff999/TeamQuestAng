import { Component } from '@angular/core';
import { PredictionService } from 'src/app/services/prediction.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent {
  status: string | null = null;
  error: string | null = null;

  constructor(private predictionService: PredictionService) {}

  predict() {
    const data = {
      Attendance: 250,
      year: 2025,
      month: 5,
      day: 19,
      category_encoded: 2 // Adjust based on your LabelEncoder mapping
    };

    this.predictionService.predict(data).subscribe({
      next: (response) => {
        this.status = response;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Error making prediction: ' + err.message;
        this.status = null;
      }
    });
  }
}