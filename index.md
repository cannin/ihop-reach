An application for users to access biological data extracted from biomedical literature

### GSoC19 Report
<ul>
  {% for post in site.reports %}
    {% if post.tags contains "gsoc" %}
      <li>
        <small>{{post.date | date: "%b %d, %y"}}</small> <a href="{{ post.url }}">{{ post.title }}</a>
      </li>
    {% endif %}
  {% endfor %}
</ul>


### Contributers
<ul>
  {% for member in site.data.contributers %}
      <li>
        <a title="{{ member.bio }}" target="_blank" href="https://github.com/{{member.github}}">{{ member.name }} ({{ member.position }})</a>
      </li>
  {% endfor %}
</ul>