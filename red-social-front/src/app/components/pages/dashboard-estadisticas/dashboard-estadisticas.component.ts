import { Component, OnInit } from '@angular/core';
import { ChartData, ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { EstadisticasService } from '../../../services/estadisticas/estadisticas.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    selector: 'app-dashboard-estadisticas',
    templateUrl: './dashboard-estadisticas.component.html',
    styleUrls: ['./dashboard-estadisticas.component.css'],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgChartsModule],
})
export class DashboardEstadisticasComponent implements OnInit {
    form: FormGroup;

    // 📊 1. Publicaciones por usuario
    publicacionesChart: ChartData<'bar'> = {
        labels: [],
        datasets: [{ data: [], label: 'Publicaciones por usuario' }]
    };

    // 💬 2. Comentarios por publicación
    comentariosChart: ChartData<'bar'> = {
        labels: [],
        datasets: [{ data: [], label: 'Comentarios por publicación' }]
    };

    chartOptions: ChartOptions = { 
        responsive: true,
        maintainAspectRatio: false
    };
    chartType: ChartType = 'bar';
    chartTypeComentarios: ChartType = 'bar';

    // 🧮 3. Total comentarios
    totalComentarios: number = 0;

    constructor(
        private estadisticasService: EstadisticasService,
        private fb: FormBuilder
    ) {
        const hoy = new Date().toISOString().substring(0, 10);
        this.form = this.fb.group({
        desde: ['2024-01-01'],
        hasta: [hoy]
        });
    }

    ngOnInit(): void {
        this.cargarEstadisticas();
    }

    cargarEstadisticas(): void {
        const { desde, hasta } = this.form.value;

    // 1. Publicaciones por usuario
    this.estadisticasService.getPublicacionesPorUsuario(desde, hasta).subscribe(data => {
        this.publicacionesChart = {
        labels: data.map(u => `${u.nombre} ${u.apellido}`),
        datasets: [{ data: data.map(u => u.totalPublicaciones), label: 'Publicaciones por usuario' }]
        };
    });

    // 2. Comentarios totales
    this.estadisticasService.getComentariosTotales(desde, hasta).subscribe(data => {
        this.totalComentarios = data.totalComentarios;
        console.log('Total comentarios:', this.totalComentarios);
    });

    // 3. Comentarios por publicación
    this.estadisticasService.getComentariosPorPublicacion(desde, hasta).subscribe(data => {
        this.comentariosChart = {
        labels: data.map(p => p.titulo),
        datasets: [{ data: data.map(p => p.totalComentarios), label: 'Comentarios por publicación' }]
        };
    });
    }
}