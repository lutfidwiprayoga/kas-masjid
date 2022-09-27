@extends('layouts.main')
@section('title', 'Donasi')
@section('container')
    <!-- MAIN CONTENT -->
    <div class="main-content">
        <div id="toastr-demo" class="panel">
            <div class="panel-body">
                <!-- CONTEXTUAL -->
                <h4 style="margin-left: 3%">Donasi</h4>
                <p class="demo-button">
                    <button type="button" class="btn btn-primary btn-toastr pull-right" data-toggle="modal"
                        data-target="#modal" style="margin-right: 3%">Donasi</button>
                </p>
                <br>
                <div class="panel-body">
                    <table class="table table-striped" id="table-donasi">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama</th>
                                <th>Nama Bank</th>
                                <th>Nominal</th>
                                <th>Tanggal</th>
                                <th>Foto</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($item as $i => $dt)
                                <tr>
                                    <td>{{ ++$i }}</td>
                                    <td>{{ $dt->nama }}</td>
                                    <td>{{ $dt->jenis_rek }}</td>
                                    <td>Rp. {{ number_format($dt->jumlah) }}</td>
                                    <td>{{ date('l d M Y H:i:s', strtotime($dt->tanggal)) }}</td>
                                    <td><img src="{{ url('foto/' . $dt->foto) }}" width="80px">
                                    </td>
                                    <td>
                                        @if ($dt->status == 'Diterima')
                                            <label class="label label-success">{{ $dt->status }}</label>
                                        @elseif ($dt->status == 'Diverifikasi')
                                            <label class="label label-warning">{{ $dt->status }}</button>
                                            @elseif ($dt->status == 'Ditolak')
                                                <label class="label label-danger">{{ $dt->status }}</button>
                                        @endif
                                    </td>
                                    <td>
                                        <div class="row">
                                            <div class="col-sm-1">
                                                <button class="submit badge bg-danger" style="border: 0ch"
                                                    data-target="#deleteDonasi{{ $dt->id }}" data-toggle="modal"><i
                                                        class="fa fa-trash"></i></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                <!-- END CONTEXTUAL -->
            </div>
        </div>
    </div>
    <!-- Modal Tambah Data-->
    <div class="container">
        <div class="modal fade" id="modal" aria-labelledby="modalLabel" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="data">{{ $title }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form action="{{ route('donasi.post') }}" method="post" enctype="multipart/form-data">
                            @csrf
                            <div class="form-group">
                                <label for="nama" class="col-form-label">Nama</label>
                                <input type="text" class="form-control" type="text" id="nama" name="nama"
                                    value="{{ old('nama') }}">
                            </div>
                            <div class="form-group">
                                <label for="jenis_rek" class="col-form-label">Nama Bank</label>
                                <input type="text" class="form-control" type="text" id="jenis_rek" name="jenis_rek"
                                    value="{{ old('jenis_rek') }}">
                            </div>
                            <input type="hidden" name="status" value="Diverifikasi">
                            <div class="form-group">
                                <label for="jumlah" class="col-form-label">Nominal</label>
                                <input class="form-control" type="number" id="jumlah" name="jumlah"
                                    value="{{ old('jumlah') }}">
                            </div>
                            <input type="hidden" name="tanggal" value="{{ $now }}">
                            {{-- <div class="form-group">
                        <label for="tanggal" class="col-form-label">Tanggal</label>
                        <input class="form-control" data-toggle="datepicker" type="text" id="tanggal" name="tanggal">
                    </div> --}}
                            <div class="form-group">
                                <label class="col-form-label" for="foto">Foto</label>
                                <input type="file" class="form-control" id="foto" name="foto">
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
    <!-- MODAL Update Data -->
    @foreach ($item as $i => $dt)
        <div class="container">
            <div class="modal fade" id="modalEdit{{ $dt->id }}" aria-labelledby="modalLabel" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="data">{{ $title }}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form action="{{ route('donasi.update', $dt->id) }}" method="post"
                                enctype="multipart/form-data">
                                @csrf
                                <div class="form-group">
                                    <label for="nama" class="col-form-label">Nama</label>
                                    <input type="text" class="form-control" type="text" id="nama"
                                        name="nama" value="{{ $dt->nama }}">
                                </div>
                                <div class="form-group">
                                    <label for="jenis_rek" class="col-form-label">Jenis Rekening</label>
                                    <input type="text" class="form-control" type="text" id="jenis_rek"
                                        name="jenis_rek" value="{{ $dt->jenis_rek }}">
                                    {{-- <select name="jenis_rek" id="jenis_rek" class="form-control">
                                <option value="BNI">BNI</option>
                                <option value="BRI">BRI</option>
                                <option value="BCA">BCA</option>
                                <option value="Mandiri">Mandiri</option>
                            </select> --}}
                                </div>
                                <div class="form-group">
                                    <label for="jumlah" class="col-form-label">Nominal</label>
                                    <input class="form-control" type="number" id="jumlah" name="jumlah"
                                        value="{{ $dt->jumlah }}">
                                </div>
                                <input type="hidden" name="tanggal" value="{{ $dt->tanggal }}">
                                {{-- <div class="form-group">
                            <label for="tanggal" class="col-form-label">Tanggal</label>
                            <input class="form-control" data-toggle="datepicker" type="text" id="tanggal" name="tanggal">
                        </div> --}}
                                <div class="form-group">
                                    <label class="col-form-label" for="foto">Foto</label>
                                    <input type="file" class="form-control" id="foto" name="foto">
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
    @endforeach
    <!-- Modal Delete Data -->
    @foreach ($item as $dt)
        <div class="modal fade" id="deleteDonasi{{ $dt->id }}">
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content bg-default">
                    <div class="modal-header">Hapus Data</div>
                    <form action="{{ route('donasi.delete', $dt->id) }}" method="POST">
                        @csrf
                        @method('DELETE')
                        <div class="modal-body">
                            <p>Apakah anda Yakin Menghapus Data Donasi {{ $dt->nama }}?&hellip;
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
            var tableLaporan = $('#table-donasi').DataTable({});
        });
    </script>
@endsection
