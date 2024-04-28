<!DOCTYPE html>
<html>
<head>
	<title>Website Test</title>
	<link rel="stylesheet" type="text/css" href="./styles.css" />
    <script type='text/javascript' language='javascript' src='./script.js' ></script>
    <meta http-equiv="Permissions-Policy" content="interest-cohort=()">
</head>

<body onload="pageLoad()">
    <header>
	<h2>Crisis Aid</h2>
    </header>

    <section>
        <table id="crisisTable">
            <tr>
                <th>Time</th>
                <th>Date</th>
                <th>Country</th>
            </tr>
        </table>
    </section>

    <section id="formSection">
       
        <form name="addCrisis" action="" method="GET" id="addCrisisForm">
            <label for="CountryInputBox">Add New Crisis:</label><br>
            <input type="text" name="CountryInput" value="" id="CountryInputBox" placeholder="Country...">
            <input type="button" value="Submit" onClick="newCrisis(this.form)">
        </form>
    </section>

    <section>
        <h2>hello</h2>
        <?php
            $jsonText = file_get_contents("tableData.json")
            ?>
            <p>$jsonText</p>
            <?php
        ?>
    </section>

    <input type="button" value="test" onclick="pageLoad()">
</body>
</html>