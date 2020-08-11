FROM centos:centos7

#Locale
ENV LANG=en_US.UTF-8  

RUN ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo Asia/Shanghai > /etc/timezone

RUN mkdir -p /opt/push 
ADD ./ /opt/push 
WORKDIR /opt/push
RUN yum update -y && \
    curl --silent --location https://rpm.nodesource.com/setup_10.x | bash - \
    && yum install -y nodejs \
    && npm install -g cnpm --registry=https://registry.npm.taobao.org \
    && cnpm install nodemon -g \
    && yum -y install epel-release \
    && rpm -v --import http://li.nux.ro/download/nux/RPM-GPG-KEY-nux.ro \
    && rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-5.el7.nux.noarch.rpm \
    && yum -y install ffmpeg ffmpeg-devel \
    && cnpm install \
    && yum clean all 

ENTRYPOINT [ "sh", "-c", "cd /opt/push && nodemon index.js" ]
