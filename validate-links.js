/*
A) Write a function (JavaScript, Python, or Scala)

NB: Doing this in PHP with a call to filter_var($url, FILTER_VALIDATE_URL)
and then a cURL request to get the status code would have been my first
choice as a solution but fell outside the bounds of the spec.

The function must accept a list of URLs and return a subset of those links that
are either written incorrectly or do not return a success status code, along with
a way to identify what was wrong with each link.

If you end up with extra time, feel free to comment on the following in your code:
Could the function be improved if the same list of links is being passed in many
times, and what are the tradeoffs?
How might the function be written to process arbitrarily long lists of links?
How might this function be exposed as an HTTP API to be used by a front-end application?
*/
function validateLinks(links){
  var badLinks = [];
  $.each(links, function(key, link){
    if (re_weburl.test(link)) {
      // URL is valid, need to test it returns success status code
      $.ajax(
        {
          url: link,
          crossDomain: true,
          async: false,
          error: function(jqXHR, textStatus, errorThrown) {
            if (!textStatus) {
              badLinks.push({"url":link, "reason":errorThrown});
            } else {
              badLinks.push({"url":link, "reason":textStatus});
            }
          }
        }
      );

    } else {
      // URL is invalid, add to list of bad links
      badLinks.push({"url":link, "reason":"invalid url"});
    }
  });
  return badLinks;
}
