<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admit Card</title>
    <style>
        /* Add your CSS styles for the admit card here */
        body {
            font-family: 'Times New Roman', Times, serif, sans-serif;
        }

        .admit-card {
            width: 100%;
            border: 1px solid #000;
            margin: 10px auto;
            /* Center aligning the content of the admit card */
        }

        .admit-card h2,
        .admit-card h3 {
            text-align: center;
            /* Center aligning the specified headings */
            margin-bottom: 1px;
            /* Reduced space below headings */
        }

        .admit-card p {
            margin-bottom: 1px;
            /* Reduced space below paragraphs */
        }

        .p-center {
            text-align: center;
        }

        .admit-card li {
            font-size: 13px;
        }

        .detail-box {
            border: 1px solid #000;
            padding: 10px;
            margin: 10px;
        }

        .picture-box {
            position: fixed;
            top: 30px;
            right: 10px;
            width: 120px;
            /* Adjust width and height as needed */
            height: 120px;
            border: 1px solid #000;
            /* Add any other styling you desire */
        }
    </style>
</head>

<body>

    <div class="admit-card">
        <div class="picture-box">
            <img style="max-height: 150px" src="{{ $data['student_img'] ?? '' }}">
        </div>
        <h2>Shifa Tameer-e-Millat University</h2>
        <h3>Admit Card</h3>
        <h3>{{ $data['college_name'] ?? '' }}</h3>
        <h3>{{ $data['program_name'] ?? '' }}</h3>
        <p class="p-center">For Intake Year: Spring-2025</p>
        <div class="detail-box">
            <p><strong>Program Name:</strong> {{ $data['program_name'] ?? '' }}</p>
            <p><strong>Test Date:</strong>
                @if ($data['program_id'] == 34 || $data['program_id'] == 35)
                    Thursday, June 13<sup>th</sup>, 2024
                @elseif ($data['program_id'] == 8)
                    Saturday, October 12<sup>th</sup>, 2024
                @elseif ($data['program_id'] == 20 || $data['program_id'] == 21 || $data['program_id'] == 22 || $data['program_id'] == 23)
                    Thursday, July 25<sup>th</sup>, 2024
                @endif
            </p>
            @if ($data['program_id'] == 20 || $data['program_id'] == 21 || $data['program_id'] == 22 || $data['program_id'] == 23)
                <p><strong>Reporting Time:</strong> 08:30 AM</p>
                <p><strong>Test Time:</strong> 09:00 AM</p>
                <p><strong>Interview Date and Time:</strong> Thursday, July 25<sup>th</sup>, 2024 09:00 AM</p>
            @else
                <p><strong>Reporting Time:</strong> 09:00 AM</p>
                <p><strong>Test Time:</strong> 10:00 AM</p>
            @endif

            <p><strong>Venue:</strong>
                @if ($data['program_id'] == 34 || $data['program_id'] == 35)
                    Shifa College of Nursing Block H-5, Shifa International Hospital Pitras Bukhari Road, Sector H-8/4,
                    Islamabad (Tel: 051-8463619)
                @elseif ($data['program_id'] == 8)
                    Shifa Tameer-e-Millat University Park Road Campus, Chak Shahzad, Islamabad. (Refer to Page 2 for
                    Map)
                @elseif ($data['program_id'] == 20 || $data['program_id'] == 21 || $data['program_id'] == 22 || $data['program_id'] == 23)
                    Department of Rehabilitation Sciences, Shifa Tameer-e-Millat University, (Park Road Campus), Park
                    Road, Chak Shehzad , Islamabad.
                @endif

            </p>
            <p><strong>Entrance Test Roll No:</strong>
                @if ($data['program_id'] == 34)
                    PRN-2024-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 8)
                    BSN-2024-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 35)
                    MSN-2024-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 20)
                    DPT-2024-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 21)
                    BSAUD-2024-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 22)
                    BSSLP-2024-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 23)
                    MSPT-2024-{{ $data['student_id'] ?? '' }}
                @endif
            </p>
            <p><strong>Candidate Name:</strong> {{ $data['student_first_name'] ?? '' }}
                {{ $data['student_last_name'] ?? '' }}</p>
            <p><strong>Father's Name:</strong> {{ $data['father_name'] ?? ('' ?? '') }}</p>
            <p><strong>CNIC No:</strong> {{ $data['cnic'] ?? ('' ?? '') }}</p>
        </div>
        @if ($data['program_id'] == 20 || $data['program_id'] == 21 || $data['program_id'] == 22 || $data['program_id'] == 23)
            <p><strong>Test Pattern</strong></p>
            <ol>
                <li>Entry test for DPT, BS-AUD, BS-SLP, BS-PO and MS-PT comprises of 100 MCQs that are to be
                    completed within 02 Hours.</li>
                <li>All questions carry equal marks (1 mark each). There is NO negative marking in the paper.</li>
            </ol>
            <p><strong>General Instructions:</strong></p>
            <ol>
                <li>Bring your original CNIC/B-Form, admit card & paid fee voucher for the test.</li>
                <li>Make sure you reach the test venue on time.</li>
                <li>Once inside the test venue, mark your attendance on the registration desk and follow the
                    instructions to find the seat marked with your test roll no.</li>
                <li>Once the test is complete, remain seated until otherwise guided by invigilation staff.</li>
                <li>You would be provided an Optical Mark Reader (OMR) sheet at the start of the test. Mark your test
                    roll
                    no on it. You may use any blue or black ball pen/lead pencil to mark your roll number and the
                    answers on the sheet.</li>
                <li>Mark your attendance and write down your roll no and OMR sheet no on the attendance sheet provided
                    to you in the examination hall.</li>
                <li>Do not overwrite or mark multiple answers. Ensure that circles on the OMR are filled completely.
                </li>
                <li>Do not signal or talk to any other candidate. Any non-compliance would result in disqualification to
                    appear in the test.</li>
                <li>Please bring stationery (clipboard, pencil, and black ball pen to fill the OMR sheet).</li>
            </ol>
        @else
            <p><strong>General Instructions:</strong></p>
            <ol>
                <li>Bring your original CNIC/B-Form, admit card & paid fee voucher for the test.</li>
                <li>Make sure you reach test venue at sharp.</li>
                <li>Once inside the test venue mark your attendance on the registration desk and follow the instructions
                    to
                    find the seat marked with your test roll no.</li>
                <li>Once the test is complete, remain seated until otherwise guided by invigilation staff.</li>
                <li>You would be provided an Optical Mark Reader (OMR) sheet at the start of the test. Mark your test
                    roll
                    no on it. You may use any blue or black ball pen/lead pencil to mark your roll number and the
                    answers on
                    the sheet.</li>
                <li>Mark your attendance and write down your roll no and OMR sheet no on the attendance sheet provided
                    to
                    you in the examination hall.</li>
                <li>Do not overwrite or mark multiple answers. Ensure that circles on the OMR are filled completely.
                </li>
                <li>Do not signal or talk to any other candidate. Any non-compliance would result in disqualification to
                    appear in the test.</li>
                <li>Please bring stationary (Clipboard, Pencil, and black ball pen to fill the OMR Sheet).</li>
            </ol>
        @endif
        @if (
            $data['program_id'] != 35 &&
                $data['program_id'] != 20 &&
                $data['program_id'] != 21 &&
                $data['program_id'] != 22 &&
                $data['program_id'] != 23)
            <p><strong>Test Pattern:</strong></p>
            <ol>
                <li>The test comprises of 70 MCQ’s that are to be completed within 01 hour & 30 minutes.</li>
                @if ($data['program_id'] == 8)
                    <li>The test comprises of 04 sections - English, Science, Math, and Analytical Reasoning.</li>
                @endif
                <li>All questions carry equal marks (1 mark each). There is <b>NO negative marking</b> in the paper.
                </li>
            </ol>
        @endif
        @if ($data['program_id'] == 20 || $data['program_id'] == 21 || $data['program_id'] == 22 || $data['program_id'] == 23)
            <p><strong>Note:</strong></p>
            <ul>
                <li>Electronic gadgets / mobiles/calculator are not allowed.</li>
            </ul>
        @else
            <p><strong>Note:</strong></p>
            <ul>
                <li>Entry without Admit card & CNIC is not allowed.</li>
                <li>Electronic gadgets / mobiles/calculator are not allowed.</li>
                <li>Relatives OR Family members are NOT allowed inside the test campus.</li>
            </ul>
        @endif
        @if ($data['program_id'] == 8)
            <hr> <!-- Horizontal line -->
            <!-- Add routes for Program ID 8 -->
            <h3>Routes to STMU Park Road Campus (Near Comsats)</h3>
            <ul>
                <li>
                    <strong>Route 1:</strong> Faizabad -> Rawal Dam Chowk -> Park Road (Chak Shahzad) -> STMU (Near
                    Comsats)
                    <br>
                    <a href="https://maps.app.goo.gl/AtoE7tSE5udhhnrE7" target="_blank">View on Google Maps</a>
                    <br>
                    <br>

                </li>
                <li>
                    <strong>Route 2:</strong> Serena Chowk -> Rawal Dam Chowk -> NIH -> NARC -> Park Road (Chak Shahzad)
                    -> STMU (Near Comsats)
                    <br>
                    <a href="https://maps.app.goo.gl/h65Am71vxgydQKAMA" target="_blank">View on Google Maps</a>
                    <br>
                    <br>

                </li>
                <li>
                    <strong>Route 3:</strong> Khanapul -> Burma Town -> Tarlai -> Taramari Chowk -> Park Road (Chak
                    Shahzad) -> STMU (Near Comsats)
                    <br>
                    <a href="https://maps.app.goo.gl/tDhvs3m38p4kUg1L6" target="_blank">View on Google Maps</a>
                    <br>
                    <br>

                </li>
            </ul>
        @endif



    </div>

</body>

</html>
