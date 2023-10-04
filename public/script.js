document.getElementById('body').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
});

document.getElementById('fileInput').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        document.getElementById('uploadForm').submit();
        document.getElementById('loading').style.display = 'block';
        document.getElementById('svgContainer').style.display = 'none';
        document.getElementById('svgContainer2').style.display = 'none';
    }
});
