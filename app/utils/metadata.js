var META_DATA = (function(){
    function title(content){
        content = content || 'Adverview';
        document
            .querySelector('title')
            .innerText = content;

    }

    function description(content){
        content = content || 'Adverview';
        document
            .querySelector('[name="description"]')
            .setAttribute('content', content);
    }

    function titleOg(content){
      content = content || 'Adverview';
      document
          .querySelector('[property="og:title"]')
          .setAttribute('content', content);
    }

    function descriptionOg(content){
        content = content || 'Adverview';
        document
            .querySelector('[property="og:description"]')
            .setAttribute('content', content);
    }

    function urlOg(content){
        content = content || 'https://adverview.com/';
        document
            .querySelector('[property="og:url"]')
            .setAttribute('content', content);
    }

    function imageOg(content){
        content = content || 'https://adverview.com/images/logo.png';
        document
            .querySelector('[property="og:image"]')
            .setAttribute('content', content);
    }

    return {
        title: title,
        description: description,
        titleOg: titleOg,
        descriptionOg: descriptionOg,
        imageOg: imageOg,
        urlOg: urlOg
    };
}());
