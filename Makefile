#!/bin/sh


default: install 
install:
	npm install
	npm install nodemon
	bower install
	pip3 install mip
	echo $(EOF) | sml -m "sml/unify.cm"

compile:
	echo $(EOF) | sml -m "sml/unify.cm"

test:
	sml -m "sml/unit_test/unit_test.cm"
