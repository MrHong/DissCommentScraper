# DissCommentScraper
Scraping and sorting (by time) comments from a website.

## Funtionality
This Script reads the whole commenttree of a business-gazeta.ru/article site and sorts the whole tree including every subcomment by the 'data-public-time' attribute. 
From the sorted tree it creates a downloadable file with all the comments and data for further editing. The resulting file should be downloaded automatically or the browser will ask you where to store the resulting file.


### Prerequisites
Software used:
  - Chrome 74.0.3729      [Website](https://www.google.com/chrome/)
  - Tampermonkey 4.8      [Website](https://www.tampermonkey.net/)

The whole Setup should also work with Firefox as Browser and Greasemonkey as Userscript Manager.

## Installing
After installing an userscriptmanager in the browser of your choice, create a new userscript and copy the contents of into the script. Save the userscript and navigate to the article of your choice. 

## Authors

* **Andreas Lupp**   - *Initial work*    - [MrHong](https://github.com/MrHong)
