@extends('layouts.main')
@section('title', 'Pemasukan')
@section('container')
    <!-- Pemasukan Inputan Admin -->
    <div class="main-content">
        <div id="toastr-demo" class="panel">
            <div class="panel-body">
                <!-- CONTEXTUAL -->
                <h4 style="margin-left: 3%">Pemasukan Keuangan</h4>
                <p class="demo-button">
                    <button type="button" class="btn btn-primary btn-toastr pull-right" data-toggle="modal"
                        data-target="#data" style="margin-right: 3%">Tambah Data</button>
                </p><br>
                <div class="panel-body">
                    <table class="table table-striped" id="table-pemasukan">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Tanggal</th>
                                <th>Deskripsi</th>
                                <th>Nominal</th>
                                <th>Bukti</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($keuangan as $item => $row)
                                <tr>
                                    <td>{{ ++$item }}</td>
                                    <td>{{ date('l d M Y H:i:s', strtotime($row->tanggal)) }}</td>
                                    <td>{{ $row->deskripsi }}</td>
                                    <td>Rp. {{ number_format($row->pemasukan) }}</td>
                                    <td><img src="{{ url('foto/' . $row->foto) }}" width="80px">
                                    </td>
                                    <td>
                                        <div class="row">

                                            <div class="col-sm-1">
                                                <button class="submit badge bg-danger" style="border: 0ch"
                                                    data-target="#deletePemasukan{{ $row->id }}"
                                                    data-toggle="modal"><i class="fa fa-trash"></i></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <!-- ========Modal Tambah Pemasukan ==========-->
    <div class="container">
        <div class="modal fade" id="data" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="data">Pemasukan Keuangan</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form action="{{ route('pemasukan.post') }}" method="post" enctype="multipart/form-data">
                            @csrf
                            <input type="hidden" name="tanggal" value="{{ $now }}">
                            <div class="form-group">
                                <label for="deskripsi" class="col-form-label">Deskripsi</label>
                                <input class="form-control" type="text" id="deskripsi" name="deskripsi"
                                    value="{{ old('deskripsi') }}">
                            </div>
                            <div class="form-group">
                                <label for="pemasukan" class="col-form-label">Nominal</label>
                                <input class="form-control" type="number" id="pemasukan" name="pemasukan"
                                    value="{{ old('pemasukan') }}">
                            </div>
                            <input type="hidden" name="status" value="pemasukan">
                            <div class="form-group">
                                <label class="col-form-label" for="foto">Nota</label>
                                <input type="file" class="form-control" id="foto" name="foto" />
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Keluar</button>
                                <button type="submit" class="btn btn-primary">Kirim</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Delete Data -->
    @foreach ($keuangan as $row)
        <div class="modal fade" id="deletePemasukan{{ $row->id }}">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content bg-default">
                    <div class="modal-header">Hapus Data</div>
                    <form action="{{ route('pemasukan.destroy', $row->id) }}" method="POST">
                        @csrf
                        @method('DELETE')
                        <div class="modal-body">
                            <p>Apakah anda Yakin Menghapus Data Ini ?&hellip;
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
    <script>
        $(document).ready(function() {
            var tableLaporan = $('#table-donasiDiterima').DataTable({});
            var tableLaporan = $('#table-pemasukan').DataTable({});
        });
    </script>
@endsection
