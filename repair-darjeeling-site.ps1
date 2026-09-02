param(
  [string]$ProjectPath = "C:\Users\abhissar\Downloads\Darjeeling"
)
$ErrorActionPreference = "Stop"
Set-Location $ProjectPath

$promo = @'
{% if promotion.active %}
<aside class="promo-banner" aria-label="Current festive travel offer">
  <div class="container mx-auto px-4 py-4">
    <div class="flex flex-col items-center justify-between gap-5 lg:flex-row">
      <div class="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <div class="promo-discount-badge" aria-hidden="true"><span>UP TO</span><strong>50%</strong><span>OFF</span></div>
        <div>
          <p class="promo-eyebrow">{{ promotion.eyebrow }}</p>
          <p class="promo-title">{{ promotion.title }}</p>
          <p class="promo-description">{{ promotion.description }}</p>
        </div>
      </div>
      <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <a href="{{ promotion.ctaUrl | htmlBaseUrl }}" class="promo-primary">{{ promotion.ctaLabel }}</a>
        <a href="{{ promotion.secondaryUrl | htmlBaseUrl }}" class="promo-secondary">{{ promotion.secondaryLabel }}</a>
      </div>
    </div>
    <details class="promo-terms"><summary>View offer terms</summary><p>{{ promotion.terms }}</p></details>
  </div>
</aside>
{% endif %}
'@
Set-Content "src\_includes\components\promo-banner.njk" $promo -Encoding UTF8

$ads = @'
<section class="section bg-white" aria-labelledby="partner-with-us-title">
  <div class="container mx-auto px-4">
    <div class="section-heading">
      <p class="eyebrow">Grow Your Hospitality Business</p>
      <h2 id="partner-with-us-title">Partner With Us</h2>
      <p>Promote your hotel, homestay, eco-lodge or local travel experience to customers planning Northeast India journeys.</p>
    </div>
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {% for ad in advertisements %}
      <article class="ad-card">
        <div class="relative overflow-hidden">
          <img src="{{ ad.image | htmlBaseUrl }}" width="640" height="420" alt="Advertising space for a hotel or homestay in {{ ad.location }}" class="h-48 w-full object-cover" loading="lazy" decoding="async">
          <span class="sponsored-label">Sponsored Slot</span>
          {% if ad.highlight %}<span class="ad-highlight">{{ ad.highlight }}</span>{% endif %}
        </div>
        <div class="flex flex-1 flex-col p-6">
          <p class="text-sm font-bold text-primary">{{ ad.location }}</p>
          <h3 class="mt-2 font-heading text-2xl font-bold text-forest">{{ ad.name }}</h3>
          <p class="mt-3 text-gray-600">{{ ad.type }}</p>
          <div class="mt-auto flex items-end justify-between gap-4 border-t border-gray-100 pt-5">
            <div><span class="block text-xs text-gray-500">Advertising fee</span><strong class="block text-xl text-forest">{{ ad.price }}/month</strong></div>
            <a href="{{ '/contact/?subject=advertising#enquiry-form' | htmlBaseUrl }}" class="font-bold text-primary">Book Slot →</a>
          </div>
        </div>
      </article>
      {% endfor %}
    </div>
    <div class="partner-cta mt-12">
      <div><p class="eyebrow">Hospitality Partners</p><h3 class="font-heading text-3xl font-bold text-forest">Own a hotel or homestay?</h3><p class="mt-3 max-w-3xl text-gray-600">Ask about featured listings, destination-page placements, homepage advertising and seasonal campaigns.</p></div>
      <a href="{{ '/contact/?subject=advertising#enquiry-form' | htmlBaseUrl }}" class="btn-primary">Advertise With Us</a>
    </div>
  </div>
</section>
'@
Set-Content "src\_includes\components\eco-lodge.njk" $ads -Encoding UTF8

$promotion = @'
active: true
eyebrow: "Limited-Period Festive Offer"
title: "Durga Puja Holiday Sale"
discount: "Up to 50% Off"
description: "Celebrate Durga Puja with special savings on selected Darjeeling and Sikkim packages. Limited promotional inventory is available."
ctaLabel: "Explore Festive Offers"
ctaUrl: "/tours/"
secondaryLabel: "Get This Offer"
secondaryUrl: "/contact/#enquiry-form"
terms: "Offer applies only to selected packages, hotels, room categories and eligible travel dates. Final savings depend on availability, itinerary and group size. Terms apply."
'@
Set-Content "src\_data\promotion.yml" $promotion -Encoding UTF8

$basePath = "src\_includes\layouts\base.njk"
$base = Get-Content $basePath -Raw
# Remove every existing banner include and spacer, then insert exactly once after navbar.
$base = $base -replace '\s*<div class="header-spacer"[^>]*></div>\s*', "`r`n"
$base = $base -replace '\s*{% include "components/promo-banner\.njk" %}\s*', "`r`n"
$needle = '{% include "components/navbar.njk" %}'
$replacement = $needle + "`r`n    <div class=`"header-spacer`" aria-hidden=`"true`"></div>`r`n    {% include `"components/promo-banner.njk`" %}"
$base = $base.Replace($needle, $replacement)
# Use stable local asset URLs.
$base = $base -replace 'href="\{\{ ''/assets/css/styles\.css'' \| htmlBaseUrl \}\}"', 'href="/assets/css/styles.css"'
$base = $base -replace 'src="\{\{ ''/assets/js/main\.js'' \| htmlBaseUrl \}\}"', 'src="/assets/js/main.js"'
Set-Content $basePath $base -Encoding UTF8

# Ensure homepage has one advertisement include.
$indexPath = "src\index.njk"
$index = Get-Content $indexPath -Raw
$index = $index -replace '\s*{% include "components/eco-lodge\.njk" %}\s*', "`r`n"
$heroNeedle = '{% include "components/hero.njk" %}'
$index = $index.Replace($heroNeedle, $heroNeedle + "`r`n`r`n{% include `"components/eco-lodge.njk`" %}")
Set-Content $indexPath $index -Encoding UTF8

# Local development must use root path.
$eleventyPath = ".eleventy.js"
$eleventy = Get-Content $eleventyPath -Raw
$eleventy = $eleventy -replace 'pathPrefix:\s*"/darjeelingeco/"', 'pathPrefix: "/"'
Set-Content $eleventyPath $eleventy -Encoding UTF8

# Make dev deterministic: Eleventy builds first, Tailwind writes CSS, then Eleventy serves.
$pkgPath = "package.json"
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$pkg.scripts.'build:css' = 'tailwindcss -i ./src/assets/css/styles.css -o ./_site/assets/css/styles.css --minify'
$pkg.scripts.'build:11ty' = 'eleventy'
$pkg.scripts.build = 'npm-run-all build:11ty build:css'
$pkg.scripts.dev = 'npm run clean && npm run build && npm-run-all -p dev:11ty dev:css'
$pkg | ConvertTo-Json -Depth 20 | Set-Content $pkgPath -Encoding UTF8

Write-Host "Repair complete. Now run: npm.cmd run dev" -ForegroundColor Green
