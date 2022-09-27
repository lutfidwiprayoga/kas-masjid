@extends('layouts.main')
@section('title', 'Pemasukan Donasi')
@section('container')
    <div class="main-content">
        <div id="toastr-demo" class="panel">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-12 grid-margin stretch-card">
                        <div class="card">
                            <div class="card-header"><h4>Pemasukan Donasi On Process</h4></div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <ul class="nav nav-tabs customtab" role="tablist">
                                            <li class="nav-item active">
                                                <a class="nav-link active" data-toggle="tab" href="#home1"
                                                    role="tabpanel1" aria-selected="false">Verifikasi</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" data-toggle="tab" href="#home2" role="tabpanel2"
                                                    aria-selected="false">Ditolak</a>
                                            </li>
                                        </ul>
                                        <div class="tab-content">
                                            <!--Menunggu Verifikasi-->
                                            <div class="tab-pane fade active in" id="home1" role="tabpanel">
                                                <div class="table-responsive">
                                                    <table class="table table-striped" style="width:100%">
                                                        <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Nama Donatur</th>
                                                                <th>Email Donatur</th>
                                                                <th>Alamat Donatur</th>
                                                                <th>No Hp Donatur</th>
                                                                <th>Tanggal Donasi</th>
                                                                <th>Jumlah Donasi</th>
                                                                <th>No Rekening</th>
                                                                <th>Jenis Rekening</th>
                                                                <th>Foto</th>
                                                                <th>Validasi</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            @foreach ($validasi as $i => $row)
                                                                <tr>
                                                                    <td>{{ ++$i }}</td>
                                                                    <td>{{ $row->user->name }}</td>
                                                                    <td>{{ $row->user->email }}</td>
                                                                    <td>{{ $row->user->alamat }}</td>
                                                                    <td>{{ $row->user->no_hp }}</td>
                                                                    <td>{{ date('l, d F Y', strtotime($row->tanggal)) }}
                                                                    </td>
                                                                    <td>Rp. {{ number_format($row->jumlah) }}</td>
                                                                    <td>{{ $row->no_rek }}</td>
                                                                    <td>{{ $row->jenis_rek }}</td>
                                                                    <td><img src="{{ url('foto/' . $row->foto) }}"
                                                                            width="50px">
                                                                    </td>
                                                                    <td>
                                                                        <button class="btn btn-success"
                                                                            style="border: 0ch"
                                                                            data-target="#terimaDonasi{{ $row->id }}"
                                                                            data-toggle="modal"><i
                                                                                class="fa fa-check-circle"></i></button>
                                                                    </td>
                                                                    <td style="padding-left: 0px;">
                                                                        <button class="btn btn-danger"
                                                                            style="border: 0ch"
                                                                            data-target="#tolakDonasi{{ $row->id }}"
                                                                            data-toggle="modal"><i
                                                                                class="fa fa-close"></i></button>\
                                                                    </td>
                                                                </tr>
                                                            @endforeach
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <!--Ditolak-->
                                            <div class="tab-pane fade" id="home2" role="tabpanel2">
                                                <div class="table-responsive">
                                                    <table class="table table-striped" style="width:100%">
                                                        <thead>
                                                            <tr>
                                                                <th>No</th>
                                                                <th>Nama Donatur</th>
                                                                <th>Email Donatur</th>
                                                                <th>Alamat Donatur</th>
                                                                <th>No Hp Donatur</th>
                                                                <th>Tanggal Donasi</th>
                                                                <th>Jumlah Donasi</th>
                                                                <th>No Rekening</th>
                                                                <th>Jenis Rekening</th>
                                                                <th>Foto</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            @foreach ($ditolak as $i => $row)
                                                                <tr>
                                                                    <td>{{ ++$i }}</td>
                                                                    <td>{{ $row->user->name }}</td>
                                                                    <td>{{ $row->user->email }}</td>
                                                                    <td>{{ $row->user->alamat }}</td>
                                                                    <td>{{ $row->user->no_hp }}</td>
                                                                    <td>{{ date('l, d F Y', strtotime($row->tanggal)) }}
                                                                    </td>
                                                                    <td>{{ $row->jumlah_donasi }}</td>
                                                                    <td>{{ $row->no_rek }}</td>
                                                                    <td>{{ $row->jenis_rek }}</td>
                                                                    <td><img src="{{ url('foto/' . $row->foto) }}"
                                                                            width="50px">
                                                                    </td>
                                                                </tr>
                                                            @endforeach
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="main-content">
        <div id="toastry-demo" class="panel">
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-header"><h4>Pemasukan Donasi Diterima</h4></div>
                            <div class="card-body">
                                        <table class="table table-striped" id="table-donasiDiterima">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Tanggal</th>
                                                    <th>Deskripsi</th>
                                                    <th>Nominal</th>
                                                    <th>Bukti</th>
                                                    {{-- <th>Aksi</th> --}}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                @foreach ($pemasukan_dn as $i => $dn)
                                                    <tr>
                                                        <td>{{ ++$i }}</td>
                                                        <td>{{ date('l d M Y H:i:s', strtotime($dn->tanggal)) }}</td>
                                                        <td>{{ $dn->deskripsi }}</td>
                                                        <td>Rp. {{ number_format($dn->pemasukan) }}</td>
                                                        <td><img src="{{ url('foto/' . $dn->foto) }}" width="80px">
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            </tbody>
                                        </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Terima Data Donasi-->
    @foreach ($validasi as $row)
        <div class="modal fade" id="terimaDonasi{{ $row->id }}">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content bg-default">
                    <div class="modal-header">Tolak Data</div>
                    <form action="{{ route('donasi.terima', $row->id) }}" method="POST">
                        @csrf
                        <div class="modal-body">
                            <p>Apakah anda Yakin Menerima Donasi Ini ?&hellip;
                            </p>
                        </div>
                        <div class="modal-footer">
                            <div class="row mt-3 text-center">
                                <button type="button" class="btn btn-light" data-dismiss="modal">Tidak</button>
                                <button type="submit" class="btn btn-success">Ya,
                                    Terima</button>
                            </div>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
    @endforeach
    <!-- Modal Tolak Data Donasi-->
    @foreach ($validasi as $row)
        <div class="modal fade" id="tolakDonasi{{ $row->id }}">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content bg-default">
                    <div class="modal-header">Tolak Data</div>
                    <form action="{{ route('donasi.tolak', $row->id) }}" method="POST">
                        @csrf
                        <div class="modal-body">
                            <p>Apakah anda Yakin Menolak Data Ini ?&hellip;
                            </p>
                        </div>
                        <div class="modal-footer">
                            <div class="row mt-3 text-center">
                                <button type="button" class="btn btn-light" data-dismiss="modal">Tidak</button>
                                <button type="submit" class="btn btn-danger">Ya,
                                    Hapus</button>
                            </div>
                        </div>
                    </form>
                </div>
                <!-- /.modal-content -->
            </div>
            <!-- /.modal-dialog -->
        </div>
    @endforeach
    <!-- Datatable Pemasukan Diterima -->
    <script>
        $(document).ready(function() {
            var tableLaporan = $('#table-donasiDiterima').DataTable({});
        });
    </script>
@endsection
