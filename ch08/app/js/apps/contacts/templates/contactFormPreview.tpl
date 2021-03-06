<span class="notice">Click the image to change the avatar</span>
<div class="box thumbnail">
  <div class="photo">
    <% if (avatar && avatar.url) { %>
    <img src="<%= avatar.url %>" alt="Contact photo" />
    <% } else { %>
    <img src="http://placehold.it/250x250" alt="Contact photo" />
    <% } %>
    <input id="avatar" name="avatar" type="file" style="display: none" />
  </div>
  <div class="caption">
    <h5><%= name %></h5>
    <p class="phone no-margin"><%= phone %></p>
    <p class="email no-margin"><%= email %></p>
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
