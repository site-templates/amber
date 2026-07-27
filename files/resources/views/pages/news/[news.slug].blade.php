{{-- Dynamic page: one URL per entry of resources/data/collections/news.json, matched on `slug` — $news is the entry. Add an entry there to publish; its `content` HTML is the body. --}}
<x-layouts.post
    :title="$news->title"
    :description="$news->description"
    :category="$news->category"
    :date="$news->dateFormatted"
    :readTime="$news->readTime"
    :image="$news->image"
    :imageAlt="$news->alt">

    {!! $news->content !!}

</x-layouts.post>
