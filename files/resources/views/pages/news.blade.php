{{-- News index — served at "/news". --}}
<x-layouts.main title="News" description="Notes from the Amber studio on brand, product, and shipping design that earns its keep.">

    {{-- ============ Header ============ --}}
    <x-sections.news-header />

    {{-- ============ Posts ============ --}}
    <x-sections.news-posts :items="$news" />

</x-layouts.main>
