<div class="panel-heading">About John Doe</div>
<div class="pabel-body">
  <div class="contact-info">
    <div class="bio">
      <h4>Bio</h4>
      <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae efficitur dui, ac pellentesque nisi. Morbi sit amet nibh ante. Aenean at dui sit amet nunc elementum posuere. Fusce mauris eros, scelerisque a velit et, facilisis faucibus magna. Praesent hendrerit lacinia pharetra. Donec cursus odio nisi, maximus aliquam nibh sodales non. Sed at purus non ante efficitur semper vel et mauris.
      </p>
    </div>

    <h4>Basic information</h4>
    <div class="table-responsive">
      <table class="table">
        <tbody>
          <tr>
            <th>Email</th>
            <td><a href="mailto:<%= email %>"><%= email %></a></td>
          </tr>
          <tr>
            <th>Phone</th>
            <td><%= phone %></td>
          </tr>
          <tr>
            <th>Social</th>
            <td>
              <ul class="list-inline">
                <% if (facebook) { %>
                <li>
                  <a href="<%= facebook %>" title="Google Drive">
                    <i class="fa fa-facebook"></i>
                  </a>
                </li>
                <% } %>
                <% if (twitter) { %>
                <li>
                  <a href="<%= twitter %>" title="Twitter">
                    <i class="fa fa-twitter"></i>
                  </a>
                </li>
                <% } %>
                <% if (google) { %>
                <li>
                  <a href="<%= google %>" title="Google Drive">
                    <i class="fa fa-google-plus"></i>
                  </a>
                </li>
                <% } %>
                <% if (github) { %>
                <li>
                  <a href="<%= github %>" title="Github">
                    <i class="fa fa-github"></i>
                  </a>
                </li>
                <% } %>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h4>Personal information</h4>
    <div class="table-responsive">
      <table class="table">
        <tbody>
          <tr>
            <th>Name</th>
            <td><%= name %></td>
          </tr>
          <tr>
            <th>Address</th>
            <td><%= address1 %></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
<div class="panel-footer clearfix">
  <div class="panel-buttons">
    <button id="back" class="btn btn-default">Go back</button>
    <button id="delete" class="btn btn-danger">Delete</button>
    <button id="edit" class="btn btn-success">Edit contact</button>
  </div>
</div>
