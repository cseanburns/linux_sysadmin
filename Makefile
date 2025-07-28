.PHONY: create build commit push

create: build commit push

build:
	mdbook build .

commit:
	git add .
	git commit -m "Rebuild mdbook"

push:
	git push origin master
