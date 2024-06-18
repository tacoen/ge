<?php

// Merge two CSS files
$css1 = file_get_contents('unit.css');
$css2 = file_get_contents('ge.css');
$merged_css = $css1 . $css2;

// Function to sort, group, and remove duplicates from the merged CSS
function optimize_css($css) {
    // Split the CSS into individual rules
    $rules = explode('}', $css);
    
    // Sort the rules alphabetically
    sort($rules);
    
    // Group the rules by selector
    $grouped_rules = [];
    foreach ($rules as $rule) {
        $parts = explode('{', $rule);
        $selector = trim($parts[0]);
        $declarations = trim($parts[1]);
        if (!isset($grouped_rules[$selector])) {
            $grouped_rules[$selector] = [];
        }
        $grouped_rules[$selector][] = $declarations;
    }
    
    // Remove duplicate declarations
    foreach ($grouped_rules as $selector => $declarations) {
        $grouped_rules[$selector] = array_unique($declarations);
    }
    
    // Rebuild the CSS
    $optimized_css = '';
    foreach ($grouped_rules as $selector => $declarations) {
        $optimized_css .= "$selector { " . implode('; ', $declarations) . "; }\n";
    }

$optimized_css = preg_replace('!/\*.*?\*/!s', '', $optimized_css);

$optimized_css = preg_replace('/;;/i', ';', $optimized_css);

    
    return $optimized_css;
}

// Usage example
$optimized_css = optimize_css($merged_css);
file_put_contents('optimized.css', $optimized_css);
