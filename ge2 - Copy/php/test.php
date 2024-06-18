<?php
class GE_element {
    private $skel = array();
    public function __construct($name = 'body', $content = false, $attr = false, $tag = false) {
        if (!in_array($name, array_keys($this->skel))) {
            $this->skel[$name] = array();
            if ($tag) {
                $this->tag($name, $tag);
            } else {
                $this->tag($name, $name);
            }
            if ($attr) { $this->attrs($name, $attr); }
            if ($content) { $this->content($name, $content); }
        }
    }
    public function __get($name) {
        return $this->skel[$name];
    }
    public function __call(string $name, array $arguments): self
    {
        if ($name === 'attr') {
            return $this->attr($arguments[0]);
        } elseif ($name === 'content') {
            return $this->content($arguments[0]);			
        } elseif ($name === 'content') {
			 return $this->setTagName($arguments[0]);
		} else {
            return $this->render($name);
        }
    }
    public function setTagName($name, $tag) {
        $this->skel[$name]['tag'] = $tag;
    }
    public function attrs($name, $value) {
        if (gettype($value) == 'string') {
            $this->skel[$name]['attr'] = explode(" ", $value);
        } else {
            $this->skel[$name]['attr'] = $value;
        }
    }
    public function content($name, $value) {
        if (gettype($value) == 'string') {
            $this->skel[$name]['content'] = explode("\n", $value);
        } else {
            $this->skel[$name]['content'] = $value;
        }
    }
	public function render($name) {
		if (!empty($this->skel[$name]['attr'])) { 
			$attrs = implode(' ',$this->skel[$name]['attr'] );
		}
		if (!empty($this->skel[$name]['content'])) { 
			$content = implode("\n",$this->skel[$name]['content'] );
		} else {
			$content ='';
		}
		$html = "<" . $this->skel[$name]['tag'] ." ".$attrs.">\n";
		$html .= $content;
		$html .= "\n</" . $this->skel[$name]['tag'] . ">\n";
		return $html;
    }
	public function __toString() {
        return $this->render();
    }		
}
