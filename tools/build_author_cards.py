"""Render the static About-page cards from data/authors.json (Python standard library)."""
from pathlib import Path
from html import escape
from urllib.parse import urlparse
import argparse
import json
import re


def render(profile):
    def text(key):
        return escape(profile[key], quote=True)
    if urlparse(profile['homepage']).scheme != 'https':
        raise ValueError(f'{profile["name"]}: homepage must be an HTTPS URL')
    if not re.fullmatch(r'portraits/[a-z0-9-]+\.webp', profile['portrait_url']):
        raise ValueError(f'{profile["name"]}: portrait must be a local WebP thumbnail')
    if not re.fullmatch(r'[A-Za-z0-9.!#$%&\x27*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', profile['email']):
        raise ValueError(f'{profile["name"]}: invalid professional email')
    if not re.fullmatch(r'[a-z0-9-]+', profile['id']):
        raise ValueError('Invalid author id')
    initials = ''.join(part[0] for part in profile['name'].split())
    topics = ''.join(f'<li>{escape(topic)}</li>' for topic in profile['research_interests'])
    return f'''<article class="author-card" aria-labelledby="author-{text('id')}">
  <div class="author-card-top">
    <div class="author-portrait" data-author="{text('id')}"><span class="portrait-fallback" aria-hidden="true">{escape(initials)}</span><img src="{text('portrait_url')}" alt="Portrait of {text('name')}" width="116" height="140" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="portrait-unavailable">Photo unavailable</span></div>
    <div class="author-identity"><h4 id="author-{text('id')}">{text('name')}</h4><p class="author-role">{text('role')}</p><p class="author-institution">{text('institution')}</p></div>
  </div>
  <p class="author-bio">{text('bio')}</p>
  <div class="author-interests"><h5>Research interests</h5><ul>{topics}</ul></div>
  <div class="author-contact"><a class="author-email" href="mailto:{text('email')}" aria-label="Email {text('name')} at {text('email')}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg><span>{text('email')}</span></a><a class="author-homepage" href="{text('homepage')}" target="_blank" rel="noopener noreferrer" aria-label="View profile for {text('name')} (opens in a new tab)">View profile <span aria-hidden="true">↗</span></a></div>
</article>'''


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    data = json.loads((args.site/'data'/'authors.json').read_text(encoding='utf-8'))
    profiles = data['authors']
    if len({p['id'] for p in profiles}) != len(profiles):
        raise ValueError('Duplicate author ids')
    start, end = '<!-- AUTHOR_CARDS_START -->', '<!-- AUTHOR_CARDS_END -->'
    index = args.site/'index.html'
    markup = index.read_text(encoding='utf-8')
    if markup.count(start) != 1 or markup.count(end) != 1:
        raise ValueError('Expected one author-card region in index.html')
    prefix, rest = markup.split(start)
    _, suffix = rest.split(end)
    index.write_text(prefix+start+'\n'+'\n'.join(map(render,profiles))+'\n'+end+suffix, encoding='utf-8', newline='\n')
    print(f'Rendered {len(profiles)} author cards; source date {data["profiles_checked_on"]}.')


if __name__ == '__main__':
    main()
