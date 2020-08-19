# NotesApp

## 🔒 Private logged-in only pages, don't need SEO

## Example: (dashboard page)

- No `getServerSideProps`.
- Use client hooks only to retrieve data, with redirect to login if logged out
- Use `getStaticProps` to show logged-in header


## 🔍 Publicly accessible pages, need SEO

### 🗿 Static content

Normal plain React page with `getStaticProps` for build-time content.

### ⚡ Dynamic or user-generated content

#### Hybrid logged-in-or-out (note page)

- `getServerSideProps` serves initial props and the right header
- Client hooks do not redirect

#### Logged-out-only

- `getServerSideProps` serves initial props and the logged-out header
- Client hooks redirect to relevant page if logged in
