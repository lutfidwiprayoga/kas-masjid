<!doctype html>
<html lang="en">

<head>
    <title>@yield('title') | Masjid Subulussalam</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <!-- MAIN CSS -->
    <!-- VENDOR CSS -->
    <link rel="stylesheet" href="assets/vendor/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/vendor/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/vendor/linearicons/style.css">
    <link href="https://cdn.datatables.net/1.11.4/css/dataTables.bootstrap5.min.css" rel="stylesheet">
    {{-- <link rel="stylesheet" href="assets/vendor/chartist/css/chartist-custom.css"> --}}
    <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
    <link rel="stylesheet" href="assets/css/main.css">
    <!-- FOR DEMO PURPOSES ONLY. You should remove this in your project -->
    <link rel="stylesheet" href="assets/css/demo.css">
    {{-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script> --}}
    <!-- GOOGLE FONTS -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700" rel="stylesheet">
    <!-- ICONS -->
    <link rel="apple-touch-icon" sizes="76x76" href="assets/img/apple-icon.png">
    <link rel="icon" type="image/png" sizes="96x96" href="assets/img/masjid.1.png">

    <link rel="stylesheet" href="datepicker/css/datepicker.css">

    {{-- trix --}}
    <link rel="stylesheet" type="text/css" href="assets/css/trix.css">
    <script type="text/javascript" src="assets/scripts/trix.js"></script>
    <script src="https://cdn.datatables.net/1.11.4/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.11.4/js/dataTables.bootstrap5.min.js"></script>
    <style>
        trix-toolbar [data-trix-button-group="file-tools"] {
            display: none;
        }
    </style>
</head>

<body>
    <!-- WRAPPER -->
    <div id="wrapper">

        @include('partials.navbar')

        <!-- END NAVBAR -->

        @include('partials.sidebar')

        <!-- MAIN -->
        @include('sweetalert::alert', ['cdn' => 'https://cdn.jsdelivr.net/npm/sweetalert2@9'])
        <div class="main">
            <!-- MAIN CONTENT -->
            <div class="main-content">
                <div class="container-fluid">

                    @yield('container')

                </div>
            </div>
            <!-- END MAIN CONTENT -->
        </div>
        <!-- END MAIN -->

        @include('partials.footer')

    </div>
    <!-- END WRAPPER -->
    <!-- Javascript -->
    {{-- <script src="assets/vendor/jquery/jquery.min.js"></script> --}}
    <script src="assets/vendor/bootstrap/js/bootstrap.min.js"></script>
    <script src="assets/vendor/jquery-slimscroll/jquery.slimscroll.min.js"></script>
    {{-- <script src="assets/vendor/jquery.easy-pie-chart/jquery.easypiechart.min.js"></script> --}}
    {{-- <script src="assets/vendor/chartist/js/chartist.min.js"></script> --}}
    <script src="assets/scripts/klorofil-common.js"></script>



    <!-- jQuery -->

    <script src="datepicker/js/datepicker.js"></script>
    <script>
        $('#exampleModal').on('show.bs.modal', function(event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
            var recipient = button.data('whatever') // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this)
            modal.find('.modal-title').text('New message to ' + recipient)
            modal.find('.modal-body input').val(recipient)
        })
    </script>
    <script>
        $(function() {
            $('[data-toggle="datepicker"]').datepicker({
                autoHide: true,
                zIndex: 2048,
            });
        });
    </script>
    <script>
        document.addEventListener('trix-file-accept', function(e) {
            e.preventDefault();
        })
    </script>
    {{-- <script src="{{ asset('js/app.js') }}"></script> --}}

    <script>
        console.log(Highcharts)
    </script>

</body>

</html>
