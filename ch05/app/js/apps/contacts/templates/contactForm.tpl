<div class="panel panel-simple">
  <div class="panel-heading">General info</div>
  <div class="panel-body">
    <form class="form-horizontal">
      <div class="form-group">
        <label for="name" class="col-sm-2 control-label">Name</label>
        <div class="col-sm-10">
          <input id="name" type="text" class="form-control" placeholder="Full name" value="<%= name %>" />
        </div>
      </div>
      <div class="form-group">
        <label for="address" class="col-sm-2 control-label">Address</label>
        <div class="col-sm-10">
          <input id="address" type="text" class="form-control" placeholder="Street, number, interior, suite" value="<%= address1 %>" />
        </div>
      </div>
    </form>
  </div>
</div>

<div class="panel panel-simple">
  <div class="panel-heading">
    Phones
    <button id="new-phone" class="btn btn-primary btn-sm pull-right">New</button>
  </div>
  <div class="panel-body">
    <form class="form-horizontal phone-list-container"></form>
  </div>
</div>

<div class="panel panel-simple">
  <div class="panel-heading">
    Emails
    <button id="new-email" class="btn btn-primary btn-sm pull-right">New</button>
  </div>
  <div class="panel-body">
    <form class="form-horizontal email-list-container"></form>
  </div>
</div>

<div class="panel panel-simple">
  <div class="panel-heading">Social</div>
  <div class="panel-body">
    <form class="form-horizontal">
      <div class="form-group">
        <label for="facebook" class="col-sm-2 control-label">Facebook</label>
        <div class="col-sm-10">
          <input id="facebook" type="text" class="form-control" placeholder="https://www.facebook.com/abiee.alejandro" value="<%= facebook %>" />
        </div>
      </div>
      <div class="form-group">
        <label for="twitter" class="col-sm-2 control-label">Twitter</label>
        <div class="col-sm-10">
          <input id="twitter" type="text" class="form-control" placeholder="https://twitter.com/abieealejandro" value="<%= twitter %>" />
        </div>
      </div>
      <div class="form-group">
        <label for="google" class="col-sm-2 control-label">Google+</label>
        <div class="col-sm-10">
          <input id="google" type="text" class="form-control" placeholder="https://plus.google.com/u/0/+AbieeAlejandroEchameaMárquez" value="<%= google %>" />
        </div>
      </div>
      <div class="form-group">
        <label for="github" class="col-sm-2 control-label">Github</label>
        <div class="col-sm-10">
          <input id="github" type="text" class="form-control" placeholder="https://github.com/abiee" value="<%= github %>" />
        </div>
      </div>
    </form>
  </div>
  <div class="panel-footer clearfix">
    <div class="panel-buttons">
      <button id="cancel" class="btn btn-default">Cancel</button>
      <button id="save" class="btn btn-success">Save</button>
    </div>
  </div>
</div>
