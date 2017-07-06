$(function () {
  $("#send").click(function () {
    var msgbox = $("#textmsg").val();
    ref.push({
      comment: msgbox.split("\n").join("<br/>")
    });
    $("#textmsg").val("");
  });
  ref.on("child_added", function (data) {
    if (data.val().url) {
      $(".chatDiv ul").append("<li><img class='myImg' src='" + data.val().url + "'/></li>");
      var modal = $("#myModal");

      // Get the image and insert it inside the modal - use its "alt" text as a caption
      var img = $(".myImg");
      var modalImg = $("#img01");
      // img.onclick = function () {
      //   modal.style.display = "block";
      //   modalImg.src = this.src;
      // }
      img.click(function(){
        var store = $(this).attr("src");
        modal.css("display","block");
        console.log(store);
        modalImg.attr("src",store);
      });
      // Get the <span> element that closes the modal
      var span = document.getElementsByClassName("close")[0];

      // When the user clicks on <span> (x), close the modal
      // span.onclick = function () {
      //   modal.style.display = "none";
      // }
      span.click(function(){
        modal.css("display","none");
      });
    } else {
      $(".chatDiv ul").append("<li><b>anonymous:</b> " + data.val().comment + "</li>");
    }

    $(".chatDiv").scrollTop($(".chatDiv")[0].scrollHeight);
  });

});
