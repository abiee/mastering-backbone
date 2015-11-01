<div class="box thumbnail">
  <div class="photo">
    <img src="http://placehold.it/250x250" alt="Contact photo" />
    <div class="action-bar clearfix">
      <div class="action-buttons pull-right">
        <button id="delete" class="btn btn-danger btn-xs">delete</button>
        <button id="view" class="btn btn-primary btn-xs">view</button>
      </div>
    </div>
  </div>
  <div class="caption-container">
    <div class="caption">
      <h5><%= name %></h5>
      <% if (phone) { %>
        <p class="phone no-margin"><%= phone %></p>
      <% } %>
      <% if (email) { %>
        <p class="email no-margin"><%= email %></p>
      <% } %>
      <div class="bottom">
        <ul class="social-networks">
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
      </div>
    </div>
  </div>
</div>
