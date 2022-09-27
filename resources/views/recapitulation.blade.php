@extends('layouts.main')
@section('title', 'Rekapitulasi')
@section('container')
    <div class="main-content">
        <div id="toastr-demo" class="panel">
            <div class="panel-body">
                <!-- CONTEXTUAL -->
                <h4 style="margin-left: 3%">Rekapitulasi Pemasukan & Pengeluaran Bulanan</h4>
                <br>
                <div class="panel-body">
                    <table class="table" id="table-recap">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Bulan</th>
                                <th>Pemasukan</th>
                                <th>Pengeluaran</th>
                                <th>Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($rekape as $i => $data)
                                <tr>
                                    <td>{{ ++$i }}</td>
                                    <td>{{ $data->month }}</td>
                                    <td>Rp. {{ number_format($data->kas_masuk) }}</td>
                                    <td>Rp. {{ number_format($data->kas_keluar) }}</td>
                                    <td>Rp. {{ number_format($data->total_saldo_semua) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="4" class="text-right">Saldo Terakhir</th>
                                <th>Rp. {{ number_format($saldo_terakhir) }}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <!-- END CONTEXTUAL -->
            </div>
        </div>
    </div>
    <div class="main-content">
        <div id="toastr-demo" class="panel">
            <div class="panel-body">
                <!-- CONTEXTUAL -->
                <h4 style="margin-left: 3%">Detail Rekapitulasi Pemasukan & Pengeluaran Bulanan</h4>
                <br>
                <div class="row">
                    <form action="/recapitulation" method="GET">
                        <div class="col-md-5">
                            <input type="month" name="bulan" class="form-control">
                        </div>
                        <div class="col-md-2">
                            <button type="submit" class="btn btn-primary">Search</button>
                        </div>
                    </form>
                    @if (Request::input('bulan'))
                        <form action="{{ route('cetakpdf') }}" method="GET">
                            <input type="month" name="bulan_id" value="{{ $date }}" hidden>
                            <div class="col-md-2 pull-right">
                                <button type="submit" class="btn btn-primary">Cetak PDF</button>
                            </div>
                        </form>
                    @endif
                </div>
                <br>
                <div class="panel-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>No</th>
                                {{-- <th>Tahun</th> --}}
                                <th>Tanggal</th>
                                {{-- <th>Deskripsi</th> --}}
                                <th>Pemasukan</th>
                                <th>Pengeluaran</th>
                                <th>Saldo</th>
                            </tr>
                        </thead>
                        @if (Request::input('bulan'))
                            <tbody>
                                @foreach ($show as $i => $data)
                                    <tr>
                                        <td>{{ ++$i }}</td>
                                        <td>{{ date('d F Y', strtotime($data->tanggal)) }}</td>
                                        <td>Rp. {{ number_format($data->pemasukan) }}</td>
                                        <td>Rp. {{ number_format($data->pengeluaran) }}</td>
                                        <td>Rp. {{ number_format($data->pemasukan + $data->pengeluaran) }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th colspan="4" class="text-right">Total Saldo</th>
                                    <th>Rp.
                                        {{ number_format($show->pluck('pemasukan')->sum() + $show->pluck('pengeluaran')->sum()) }}
                                    </th>
                                </tr>
                            </tfoot>
                        @endif
                    </table>
                </div>
                <!-- END CONTEXTUAL -->
            </div>
        </div>
    </div>
    <!-- END MAIN CONTENT -->
    <script>
        $(document).ready(function() {
            var tableLaporan = $('#table-recap').DataTable({});
        });
    </script>
@endsection
