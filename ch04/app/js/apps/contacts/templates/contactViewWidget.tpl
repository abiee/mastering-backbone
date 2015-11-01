<h3>John Doe</h3>
<img src="http://placehold.it/250x250" alt="Photo" class="img-circle" />
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
