<?php
/**
 * # structure
 *
 * Builds the structure of the HTML document.
 *
 * This method sets up the structure of the HTML document by creating various HTML elements and storing them in the `$skel` array.
 * The elements created include `html`, `head`, `body`, `script`, `style`, `head_meta`, `head_js`, `head_css`, `title`, `before`, `content`, and `after`.
 * The method then sets the content of these elements and adds them to the appropriate parent elements.
 *
 * Syntax:
 * ```php
 * $this->structure();
 * ```
 *
 * Example:
 * ```php
 * $html = new GE_html();
 * $html->structure();
 * echo $html->html;
 * ```
 *
 * Test Results:
 * The `structure()` method sets up the following HTML structure:
 *
 * ```html
 * <html>
 *   <head>
 *     <title></title>
 *     <meta></meta>
 *     <script></script>
 *     <style></style>
 *   </head>
 *   <body>
 *     <!-- before -->
 *     <!-- content -->
 *     <!-- after -->
 *     <script></script>
 *   </body>
 * </html>
 * ```
 *
 * Note that the `$this->skel['after']` element is set to not print any HTML tags,
 * but instead, it only contains the `$this->skel['script']` element.
 *
 */

class GE_html  {
	use GE_traits;
    private $conf = [
        'css' => 'cache/css/',
        'html' => 'cache/html/'
    ];
	private $root;
	private $skel = array();
	public function __construct() {
		($_SERVER['DOCUMENT_ROOT']) ? $this->root = $_SERVER['DOCUMENT_ROOT'] : $this->root = getenv('PWD');
	}
	public function structure() {
		$this->skel['html'] = $this->element('html');
		$this->skel['head'] = $this->element('head');
		$this->skel['html_body'] = $this->element('body');
		$this->skel['script'] = $this->element('script');
		$this->skel['style'] = $this->element('style');
		$this->skel['head_meta'] = $this->element('head_meta', true);
		$this->skel['head_js'] = $this->element('head_js', true);
		$this->skel['head_css'] = $this->element('head_css', true);
		$this->skel['title'] = $this->element('title');
		$this->skel['before'] = $this->element('before', true);
		$this->skel['body'] = $this->element('content', true);
		$this->skel['after'] = $this->element('after', true);
		$this->skel['after']->content($this->skel['script']);
		$this->skel['head']
			->content($this->skel['title'])
			->content($this->skel['head_meta'])
			->content($this->skel['head_js'])
			->content($this->skel['head_css'])
			->content($this->skel['style']);
		$this->skel['html_body']
			->content($this->skel['before'])
			->content($this->skel['body'])
			->content($this->skel['after']);
		$this->skel['html']
			->content($this->skel['head'])
			->content($this->skel['html_body']);
	}
	public function element($tagname='html',$ignore=false) {
		$this->element = new GE_element($tagname,$ignore);
		return $this->element; 
	}
	public function __get($skel) {
		return $this->skel[$skel];
	}
	public function html() {
		return $this->html;
	}
	public function cors() {
		if (isset($_SERVER['HTTP_ORIGIN'])) {
			header('Access-Control-Allow-Origin: {'. $_SERVER['HTTP_ORIGIN'].'}');
			header('Access-Control-Allow-Credentials: true');
			header('Access-Control-Max-Age: 86400');    // cache for 1 day
		}
		if (isset($_SERVER['REQUEST_METHOD']) ) {
			if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
				if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
					header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
				}
				if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
					header('Access-Control-Allow-Headers: {'+
						$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']+'}');
				}
			}
		}
	}
	public function header_nocache($local=true) {
		header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
		header('Cache-Control: post-check=0, pre-check=0', false);
		if ($local) {
			header("Expires: Sat, 26 Jul 2000 00:00:00 GMT"); 
		}
		header('Pragma: no-cache');
	}
	public function json($in=false) {
		$this->header_nocache();
		$this->cors();
		header('Content-type: application/json');
		if ($in) {
			$input = file_get_contents('php://input');
			return json_decode($input, true);
		}
	}
	public function minify($files,$name='ge') {
        $cacheFile = $this->root."/". $this->conf('css') . $name . '.min.css';
		$result = '';
		foreach($files as $file) {
			$result . = $this->mini($file,true,true). "\n";
		}
		
		file_put_contents($cacheFile, $result);		
		
		return $result;
	}
	
    public function css($file = null, $operation = true, $force = false) {
        if ($operation) {
            return $this->mini($file, $force);
        } else {
            return $this->get($file);
        }
    }
    public function conf($what, $dir) {
        $this->conf[$what] = $dir;
        if (!is_dir($this->conf[$what])) {
            mkdir($this->conf[$what], 0755, true);
        }
        return $this->conf[$what];
    }
    public function get($file) {
        $Content = file_get_contents($this->root."/".$file);
        return $Content;
    }
    public function mini($file, $force = false) {
        $cacheFile = $this->root."/".$this->conf('css') . pathinfo($file, PATHINFO_FILENAME) . '.min.css';
        if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 86400) && !$force) {
            return file_get_contents($cacheFile);
        } else {
            $cssContent = file_get_contents($file);
            $cssContent = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $cssContent);
            $cssContent = preg_replace('/\n|\r/', '', $cssContent);
            $cssContent = preg_replace('/\s+/', ' ', $cssContent);
            $minifiedTimestamp = date('Y-m-d H:i:s');
            $cssContent = "/* Minified on: {$minifiedTimestamp} */\n" . $cssContent;
            // Save the minified CSS to the cache file
            file_put_contents($cacheFile, $cssContent);
			echo "/* ".$cacheFile. "*/";
            return $cssContent;
        }
    }
    public function pretty($file, $force = false) {
        $cacheFile = $this->root."/".$this->conf('html'). '/' . pathinfo($file, PATHINFO_FILENAME) . '.pretty.html';
        if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < 86400) && !$force) {
            return file_get_contents($cacheFile);
        } else {
            $htmlContent = file_get_contents($file);
            $dom = new DOMDocument();
            $dom->loadHTML($htmlContent, LIBXML_NOBLANKS);
            $dom->formatOutput = true;
            $prettyHtml = $dom->saveHTML();
            file_put_contents($cacheFile, $prettyHtml);
            return $prettyHtml;
        }
    }
}
?>