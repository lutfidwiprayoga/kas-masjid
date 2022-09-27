@extends('layouts.main')

@section('container')

<!-- OVERVIEW -->
<div class="panel panel-headline">
    <div class="panel-heading">
        <h3 class="panel-title">{{ $title }}</h3>
        <p class="panel-subtitle">{{ date('l d F Y',strtotime($now)) }}</p>
    </div>
    <div class="panel-body">
        <div class="row">
            <div class="row">
                <div class="col-md-9">
                    <div id="headline-chart" class="ct-chart">
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="metric">
                        <span class="icon"><i class="fa fa-download"></i></span>
                        <p>
                            <span class="number">{{ $donasi }}</span>
                            <span class="title">Donasi</span>
                        </p>
                    </div>
                    <div class="metric">
                        <span class="icon"><i class="fa fa-download"></i></span>
                        <p>
                            <span class="number">Rp. {{ number_format($pemasukan) }}</span>
                            <span class="title">Pemasukan</span>
                        </p>
                    </div>
                    <div class="metric">
                        <span class="icon"><i class="fa fa-upload"></i></span>
                        <p>
                            <span class="number">Rp. {{ number_format($pengeluaran) }}</span>
                            <span class="title">Pengeluaran</span>
                        </p>
                    </div>
                    <div class="metric">
                        <span class="icon"><i class="fa fa-credit-card"></i></span>
                        <p>
                            <span class="number">Rp. {{ number_format($total_saldo->saldo) }}</span>
                            <span class="title">Saldo Terakhir</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <br>
        <div class="row">
            <div class="col-md-6">
                <div id="rekapanChart" class="ct-chart"></div>
            </div>
        </div>
    </div>
</div>
<!-- END OVERVIEW -->

<!--====== Grafik Chart======-->
<script src="https://code.highcharts.com/highcharts.js"></script>
<script>
    Highcharts.chart('headline-chart', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Rekapitulasi Pemasukan & Pengeluaran'
    },
    xAxis: {
        categories: {!! json_encode($bulan) !!},
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Rekapitulasi Pemasukan & Pengeluaran'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>Rp. {point.y:.f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'Pemasukan',
        data: {!! json_encode($masuk) !!}

    }, {
        name: 'Pengeluaran',
        data: {!! json_encode($keluar) !!}
    }]
});
</script>
@endsection
