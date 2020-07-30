#!/usr/bin/zsh

rm examples/*.png

titles=("Simple" "Custom Edge Length" "Highlight Information" "Custom Cell Dimensions", "Strings")
files=(examples/**/*(.))

csplit --quiet README.md '/## Examples/+1'
rm README.md
rm xx01

for i in {1..$#files}; do
    node ./bplus-graphviz.js ${files[i]} | dot -Tpng > ${files[i]:r}.png
    echo >> xx00
    echo "### ${titles[i]} ([source](/${files[i]}))" >> xx00
    echo "![${titles[i]}](/${files[i]:r}.png)" >> xx00
done

mv xx00 README.md
