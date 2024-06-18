<?php

/**
 * # GE_element
 *
 * Syntax:
 * ```php
 * $element = new GE_element($tagName, $ignore = false);
 * $element->attr($attributes)->content($content);
 * echo $element;
 * ```
 *
 * Example:
 * ```php
 * $div = new GE_element('div');
 * $div->attr(['class' => 'container'])
 *     ->content('Hello, world!')
 *     ->content(new GE_element('p', true)->content('This is a paragraph.'));
 * echo $div;
 * ```
 *
 * Test Results:
 * ```
 * <div class="container">
 * Hello, world!
 * <p>This is a paragraph.</p>
 * </div>
 * ```
 *
 */
 
require_once('traits.php');

class GE_element
{
	use GE_traits;
    private $tagName;
    private $attributes = "";
    private $content = [];
	private $ignore = false;
    public function __construct( $tagName = '', $ignore = false)
    {
        $this->tagName = $tagName;
		$this->ignore = $ignore;
    }
    public function __call(string $name, array $arguments): self
    {
        if ($name === 'attr') {
            return $this->attr($arguments[0]);
        } elseif ($name === 'content') {
            return $this->content($arguments[0]);
        } elseif ($name === 'getcontent') {
            return $this->content($arguments[0]);			
        } else {
            return $this->setTagName($name);
        }
    }
    public function __set($name, $value)
    {
        if ($name === 'content') {
            $this->content = $value;
        } else {
            $this->$name = $value;
        }
    }
    private function setTagName(string $tagName): self
    {
        $this->tagName = $tagName;
        return $this;
    }
    public function attr($attributes): self
    {
		if (is_array($attributes)) {
			foreach ($attributes as $key => $value) {
				$this->attributes .= ' ' . $key . '="' . htmlspecialchars($value) . '"';
			}
		} else {
			$this->attributes = $attributes;
		}
        return $this;
    }
    public function content($content): self
    {
        if (is_array($content)) {
            $this->content = array_merge($this->content, $content);
        } else {
            $this->content[] = $content;
        }
        return $this;
    }
    public function __toString(): string
    {
        return implode("\n", $this->print());
    }
    public function print(): array
    {
		$tagopen = false;
		$html = [];
		switch($this->tagName) {
		case "title":
			$html[]  = "<title>".join('',$this->content)."</title>";
			break;
		case "h1":
		case "h2":
		case "h3":
		case "h4":
		case "h5":
		case "h6":
		case "button":
			$html_str = "";
			if (! $this->ignore) {
				$html_str .= $this->no_ds("<" . $this->tagName ." ". 
					$this->attributes .">");
			} 
			$html_str .= join('',$this->content);
			if (! $this->ignore) {
				$html_str .='</' . $this->tagName . '>';
			}
			$html[] = $html_str;
			break;
		default:
		    if (! $this->ignore) {
				$html[] = $this->no_ds("<" . $this->tagName ." ". 
					$this->attributes .">");
				$tagopen = true;
			}    
			foreach ($this->content as $item) {
				if (is_object($item) && $item instanceof GE_element) {
					$html = array_merge($html, $item->print());
				} else {
					$html[]= $this->no_leading($item);
				}
			}
			if ($tagopen) {
				$html[]= '</' . $this->tagName . '>';
			}
		} //swicth
		return $html;
    }
}