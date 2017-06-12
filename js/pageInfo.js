// 上下页
function pageInfo(pageNo) {
  $("#pageNo").val(pageNo);
  $("#pageForm").submit();
}

//分页确定
function inputPageNo(pageNo) {
  var num = $.trim($("#numberSize").val());
  num = parseInt(num);
  if(isNaN(num)) {
    return;
  } else if(num == "") {
    return;
  } else if(num < 1) {
    return;
  } else if(num > pageNo) {
    return;
  } else {
    $("#pageNo").val(num);
    $("#pageForm").submit();
  }
}

//每页显示条数
function pageSize(size) {
  $("#pageNo").val(1);
  $("#pageSize").val(size);
  $("#pageForm").submit();
}

//每页显示条数
function changePageSize() {
  $("#pageNo").val(1);
  $("#pageForm").submit();
}


//搜索响应方法，如果保证跳到第一页
function searchSubmit(e){
  if($("#pageNo").val() != 1){
    $("#pageNo").val("1");
  }
  var e = e||event;
  var elem = e.target;
  $(elem).submit();
}